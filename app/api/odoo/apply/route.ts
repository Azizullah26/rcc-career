import { type NextRequest, NextResponse } from "next/server"

const ODOO_URL = process.env.ODOO_URL || "https://erp.elrace.com"
const ODOO_DB = process.env.ODOO_DB || "odoo.elrace.com"
const ODOO_USERNAME = process.env.ODOO_USERNAME || "jawad"
const ODOO_PASSWORD = process.env.ODOO_PASSWORD || "272127212721"

interface JobApplicationData {
  jobId: string
  formData: {
    // Personal Information
    firstName?: string
    lastName?: string
    fullName?: string
    email: string
    phone: string
    dateOfBirth?: string
    dob?: string
    nationality: string
    gender: string
    maritalStatus: string

    // Experience Information
    totalExperience: string
    uaeExperience?: string
    egyptExperience?: string
    currentLocation: string
    expectedSalary: string
    joiningPossibility: string

    // Additional Information
    uaeDrivingLicense?: boolean | string
    egyptDrivingLicense?: boolean | string
    relocationPossibility: boolean | string
    languages:
      | Array<{
          language: string
          proficiency: string
        }>
      | string[]

    // Application Questions
    previouslyWorked?: boolean | string
    workDetails?: string
    relativesOrFriends?: boolean | string
    relativeNames?: string
    names?: string
    selectedRelationship?: string

    // Experience Data
    experienceData?: Record<string, string>
    currentlyWorkingStatus?: Record<number, boolean>
  }
}

class OdooService {
  private sessionId: string | null = null
  private uid: number | null = null
  private cookies: string[] = []

  async authenticate(): Promise<boolean> {
    try {
      console.log("Authenticating with Odoo at:", ODOO_URL)
      console.log("Database:", ODOO_DB)
      console.log("Username:", ODOO_USERNAME)

      const authResponse = await fetch(`${ODOO_URL}/web/session/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: {
            db: ODOO_DB,
            login: ODOO_USERNAME,
            password: ODOO_PASSWORD,
          },
          id: Math.floor(Math.random() * 1000000),
        }),
      })

      console.log("Auth response status:", authResponse.status)

      if (!authResponse.ok) {
        console.error("Authentication failed:", authResponse.status, authResponse.statusText)
        return false
      }

      // Extract cookies from response headers
      const setCookieHeaders = authResponse.headers.get("set-cookie")
      if (setCookieHeaders) {
        this.cookies = setCookieHeaders.split(", ")
        console.log("Cookies extracted:", this.cookies)
      }

      const authData = await authResponse.json()
      console.log("Auth response data:", authData)

      if (authData.result && authData.result.uid) {
        this.uid = authData.result.uid
        this.sessionId = authData.result.session_id
        console.log("Authentication successful, UID:", this.uid, "Session ID:", this.sessionId)
        return true
      }

      console.error("Authentication failed: No UID in response")
      return false
    } catch (error) {
      console.error("Authentication error:", error)
      return false
    }
  }

  async createApplicant(applicationData: JobApplicationData, cvFile?: File): Promise<any> {
    if (!this.uid) {
      throw new Error("Not authenticated - missing UID")
    }

    try {
      console.log("Creating applicant in Odoo...")

      const formData = applicationData.formData

      // Extract name
      const firstName = formData.firstName || formData.fullName?.split(" ")[0] || ""
      const lastName = formData.lastName || formData.fullName?.split(" ").slice(1).join(" ") || ""
      const fullName = formData.fullName || `${firstName} ${lastName}`.trim()

      // Prepare applicant data
      const applicantData = {
        name: fullName,
        partner_name: fullName,
        email_from: formData.email,
        partner_phone: formData.phone,
        job_id: Number.parseInt(applicationData.jobId),

        // Custom fields
        x_date_of_birth: formData.dateOfBirth || formData.dob || "",
        x_nationality: formData.nationality || "",
        x_gender: formData.gender || "",
        x_marital_status: formData.maritalStatus || "",
        x_total_experience: formData.totalExperience || "",
        x_uae_experience: formData.uaeExperience || formData.egyptExperience || "",
        x_current_location: formData.currentLocation || "",
        x_expected_salary: formData.expectedSalary || "",
        x_joining_possibility: formData.joiningPossibility || "",
        x_uae_driving_license: formData.uaeDrivingLicense || formData.egyptDrivingLicense || false,
        x_relocation_possibility: formData.relocationPossibility || false,
        x_languages: Array.isArray(formData.languages)
          ? (formData.languages as any[])
              .map((lang) => (typeof lang === "string" ? lang : `${lang.language} (${lang.proficiency})`))
              .join(", ")
          : JSON.stringify(formData.languages || []),
        x_previously_worked: formData.previouslyWorked || false,
        x_relatives_friends: formData.relativesOrFriends || false,
        x_work_details: formData.workDetails || "",
        x_relative_names: formData.relativeNames || formData.names || "",
        x_relationship: formData.selectedRelationship || "",
        x_source_website: "RCC Career Portal",
        x_portal_url: process.env.NEXT_PUBLIC_APP_URL || "https://careerrccv5.vercel.app",

        // Experience summary
        x_experience_summary: formData.experienceData
          ? Object.entries(formData.experienceData)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n")
          : "",
        x_currently_working: JSON.stringify(formData.currentlyWorkingStatus || {}),
      }

      console.log("Applicant data prepared:", applicantData)

      // Use the JSON-RPC execute_kw method with proper authentication
      const createPayload = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "object",
          method: "execute_kw",
          args: [
            ODOO_DB, // database
            this.uid, // user id
            ODOO_PASSWORD, // password
            "hr.applicant", // model
            "create", // method
            [applicantData], // record data
          ],
        },
        id: Math.floor(Math.random() * 1000000),
      }

      console.log("Create payload:", JSON.stringify(createPayload, null, 2))

      // Prepare headers with cookies
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      if (this.cookies.length > 0) {
        headers.Cookie = this.cookies.join("; ")
      }

      if (this.sessionId) {
        headers.Cookie = (headers.Cookie ? headers.Cookie + "; " : "") + `session_id=${this.sessionId}`
      }

      console.log("Request headers:", headers)

      const createResponse = await fetch(`${ODOO_URL}/jsonrpc`, {
        method: "POST",
        headers,
        body: JSON.stringify(createPayload),
      })

      console.log("Create response status:", createResponse.status)

      if (!createResponse.ok) {
        console.error("Failed to create applicant:", createResponse.status, createResponse.statusText)
        const errorText = await createResponse.text()
        console.error("Error response:", errorText)
        throw new Error(`Failed to create applicant: ${createResponse.status} ${errorText}`)
      }

      const createData = await createResponse.json()
      console.log("Create response:", createData)

      if (createData.error) {
        console.error("Odoo error:", createData.error)
        throw new Error(createData.error.data?.message || createData.error.message || "Failed to create applicant")
      }

      const applicantId = createData.result
      console.log("Applicant created with ID:", applicantId)

      // Handle CV file upload if provided
      if (cvFile && applicantId) {
        await this.uploadCV(applicantId, cvFile)
      }

      return { success: true, applicantId }
    } catch (error) {
      console.error("Error creating applicant:", error)
      throw error
    }
  }

  async uploadCV(applicantId: number, cvFile: File): Promise<void> {
    try {
      console.log("Uploading CV for applicant:", applicantId)

      const formData = new FormData()
      formData.append("ufile", cvFile)
      formData.append("model", "hr.applicant")
      formData.append("id", applicantId.toString())

      // Prepare headers with cookies
      const headers: Record<string, string> = {}

      if (this.cookies.length > 0) {
        headers.Cookie = this.cookies.join("; ")
      }

      if (this.sessionId) {
        headers.Cookie = (headers.Cookie ? headers.Cookie + "; " : "") + `session_id=${this.sessionId}`
      }

      const uploadResponse = await fetch(`${ODOO_URL}/web/binary/upload_attachment`, {
        method: "POST",
        headers,
        body: formData,
      })

      if (!uploadResponse.ok) {
        console.error("Failed to upload CV:", uploadResponse.status, uploadResponse.statusText)
        throw new Error("Failed to upload CV")
      }

      const uploadData = await uploadResponse.json()
      console.log("CV upload response:", uploadData)
    } catch (error) {
      console.error("Error uploading CV:", error)
      // Don't throw here as the applicant was already created
    }
  }

  async testConnection(): Promise<any> {
    try {
      console.log("Testing connection to:", ODOO_URL)

      const response = await fetch(`${ODOO_URL}/web/database/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: {},
          id: 1,
        }),
      })

      console.log("Connection test response status:", response.status)

      const data = await response.json()
      console.log("Connection test response data:", data)

      return {
        success: response.ok,
        data: data,
        url: ODOO_URL,
        status: response.status,
      }
    } catch (error) {
      console.error("Connection test error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        url: ODOO_URL,
      }
    }
  }
}

// GET endpoint for testing connection
export async function GET() {
  try {
    console.log("=== GET /api/odoo/apply - Testing Connection ===")
    console.log("Environment variables:")
    console.log("ODOO_URL:", ODOO_URL)
    console.log("ODOO_DB:", ODOO_DB)
    console.log("ODOO_USERNAME:", ODOO_USERNAME)
    console.log("NODE_ENV:", process.env.NODE_ENV)

    const odooService = new OdooService()
    const connectionTest = await odooService.testConnection()

    const response = {
      success: true,
      message: "Odoo API endpoint is working",
      timestamp: new Date().toISOString(),
      connection: connectionTest,
      config: {
        url: ODOO_URL,
        database: ODOO_DB,
        username: ODOO_USERNAME,
        environment: process.env.NODE_ENV || "development",
      },
    }

    console.log("GET response:", response)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("GET request error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to test connection",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  }
}

// OPTIONS endpoint for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

// POST endpoint for job applications
export async function POST(request: NextRequest) {
  try {
    console.log("=== POST /api/odoo/apply - Job Application Submission ===")
    console.log("Request URL:", request.url)
    console.log("Request method:", request.method)

    const formData = await request.formData()
    console.log("Form data keys:", Array.from(formData.keys()))

    // Try to get data from different possible keys
    const applicationDataString =
      (formData.get("data") as string) ||
      (formData.get("applicationData") as string) ||
      (formData.get("formData") as string)

    const cvFile = formData.get("cv") as File | null

    console.log("Application data string length:", applicationDataString?.length || 0)
    console.log("CV file:", cvFile ? `${cvFile.name} (${cvFile.size} bytes)` : "No CV file")

    if (!applicationDataString) {
      console.error("Missing application data. Available keys:", Array.from(formData.keys()))
      return NextResponse.json(
        {
          success: false,
          error: "Missing application data",
          availableKeys: Array.from(formData.keys()),
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        },
      )
    }

    let applicationData: JobApplicationData
    try {
      applicationData = JSON.parse(applicationDataString)
      console.log("Application data parsed successfully for job:", applicationData.jobId)
      console.log("Form data structure:", JSON.stringify(applicationData, null, 2))
    } catch (parseError) {
      console.error("Failed to parse application data:", parseError)
      console.error("Raw data:", applicationDataString.substring(0, 500))
      return NextResponse.json(
        {
          success: false,
          error: "Invalid application data format",
          details: parseError instanceof Error ? parseError.message : "Unknown parsing error",
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        },
      )
    }

    const odooService = new OdooService()

    // Authenticate with Odoo
    console.log("Authenticating with Odoo...")
    const authenticated = await odooService.authenticate()
    if (!authenticated) {
      console.error("Odoo authentication failed")
      return NextResponse.json(
        {
          success: false,
          error: "Failed to authenticate with Odoo",
          details: "Check Odoo credentials and connection",
        },
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        },
      )
    }

    // Create applicant
    console.log("Creating applicant in Odoo...")
    const result = await odooService.createApplicant(applicationData, cvFile || undefined)

    console.log("Application submitted successfully:", result)

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully to Odoo",
        applicantId: result.applicantId,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  } catch (error) {
    console.error("Error processing job application:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit application",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  }
}
