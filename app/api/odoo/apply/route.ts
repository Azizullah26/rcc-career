import { type NextRequest, NextResponse } from "next/server"

// Add runtime configuration for Vercel
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ODOO_URL = process.env.ODOO_URL || "https://erp.elrace.com"
const ODOO_DB = process.env.ODOO_DB || "odoo.elrace.com"
const ODOO_USERNAME = process.env.ODOO_USERNAME || "jawad"
const ODOO_PASSWORD = process.env.ODOO_PASSWORD || "272127212721"

interface JobApplicationData {
  jobId: string
  jobTitle?: string
  jobName?: string
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

    // Screening Results (added by screening system)
    screeningScore?: number
    screeningPercentage?: number
    matchedRequirements?: string
    screeningDate?: string
    education?: string
    certifications?: string
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

  async getValidJobId(): Promise<number | null> {
    if (!this.uid) {
      throw new Error("Not authenticated - missing UID")
    }

    try {
      console.log("Fetching valid job IDs from Odoo...")

      // Search for active job positions
      const searchPayload = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "object",
          method: "execute_kw",
          args: [ODOO_DB, this.uid, ODOO_PASSWORD, "hr.job", "search", [[]], { limit: 1 }],
        },
        id: Math.floor(Math.random() * 1000000),
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      if (this.cookies.length > 0) {
        headers.Cookie = this.cookies.join("; ")
      }

      if (this.sessionId) {
        headers.Cookie = (headers.Cookie ? headers.Cookie + "; " : "") + `session_id=${this.sessionId}`
      }

      const searchResponse = await fetch(`${ODOO_URL}/jsonrpc`, {
        method: "POST",
        headers,
        body: JSON.stringify(searchPayload),
      })

      if (!searchResponse.ok) {
        console.error("Failed to search jobs:", searchResponse.status, searchResponse.statusText)
        return null
      }

      const searchData = await searchResponse.json()
      console.log("Job search response:", searchData)

      if (searchData.result && searchData.result.length > 0) {
        const jobId = searchData.result[0]
        console.log("Found valid job ID:", jobId)
        return jobId
      }

      console.log("No jobs found, will create applicant without job_id")
      return null
    } catch (error) {
      console.error("Error fetching job IDs:", error)
      return null
    }
  }

  async createApplicant(applicationData: JobApplicationData, cvFile?: File): Promise<any> {
    if (!this.uid) {
      throw new Error("Not authenticated - missing UID")
    }

    try {
      console.log("Creating applicant in Odoo...")

      const formData = applicationData.formData || {}

      const jobReferenceNumber = (applicationData as any).jobReferenceNumber || ""
      const referenceNumber = jobReferenceNumber || `RCC${Date.now().toString().slice(-4).padStart(4, "0")}`
      console.log("Using reference number:", referenceNumber)

      // Try multiple sources for the name
      let fullName = ""

      // First try fullName field
      if (formData.fullName && formData.fullName.trim()) {
        fullName = formData.fullName.trim()
      }
      // Then try firstName + lastName
      else if (formData.firstName || formData.lastName) {
        const firstName = (formData.firstName || "").trim()
        const lastName = (formData.lastName || "").trim()
        fullName = `${firstName} ${lastName}`.trim()
      }

      // Log the extracted name for debugging
      console.log("[v0] Extracted applicant name:", fullName)
      console.log("[v0] Form data name fields:", {
        fullName: formData.fullName,
        firstName: formData.firstName,
        lastName: formData.lastName,
      })

      const jobTitle = applicationData.jobTitle || applicationData.jobName || `Job ID: ${applicationData.jobId}`
      console.log("[v0] Job title for application:", jobTitle)

      // Use the actual applicant name, or fallback to "Applicant" if truly empty
      const applicantName = fullName || "Applicant"
      const applicantNameWithJob = `${applicantName} - ${jobTitle}`

      console.log("[v0] Final applicant name with job:", applicantNameWithJob)

      // Get a valid job ID or use null
      const validJobId = await this.getValidJobId()

      const screeningInfo = formData.screeningScore
        ? `
APPLICATION REFERENCE NUMBER: ${referenceNumber}

AUTOMATED SCREENING RESULTS:
- Screening Score: ${formData.screeningScore}/${formData.screeningPercentage ? Math.round((formData.screeningScore / formData.screeningPercentage) * 100) : 100}
- Match Percentage: ${formData.screeningPercentage}%
- Matched Requirements: ${formData.matchedRequirements || "Not specified"}
- Screening Date: ${formData.screeningDate || new Date().toISOString()}
- Status: QUALIFIED (Passed automated screening)

`
        : `
APPLICATION REFERENCE NUMBER: ${referenceNumber}

`

      const applicantData: any = {
        name: applicantNameWithJob,
        partner_name: applicantNameWithJob,
        email_from: formData.email || "",
        partner_phone: formData.phone || "",

        description: `
JOB APPLIED FOR: ${jobTitle}
Job ID: ${applicationData.jobId}

${screeningInfo}APPLICATION DETAILS:
- Applicant Name: ${applicantName}
- Date of Birth: ${formData.dateOfBirth || formData.dob || "Not provided"}
- Nationality: ${formData.nationality || "Not provided"}
- Gender: ${formData.gender || "Not provided"}
- Marital Status: ${formData.maritalStatus || "Not provided"}
- Education: ${formData.education || "Not provided"}
- Certifications: ${formData.certifications || "Not provided"}
- Total Experience: ${formData.totalExperience || "Not provided"}
- UAE Experience: ${formData.uaeExperience || formData.egyptExperience || "Not provided"}
- Current Location: ${formData.currentLocation || "Not provided"}
- Expected Salary: ${formData.expectedSalary || "Not provided"}
- Joining Possibility: ${formData.joiningPossibility || "Not provided"}
- UAE Driving License: ${formData.uaeDrivingLicense || formData.egyptDrivingLicense || "Not provided"}
- Relocation Possibility: ${formData.relocationPossibility || "Not provided"}
- Languages: ${
          Array.isArray(formData.languages)
            ? (formData.languages as any[])
                .map((lang) => (typeof lang === "string" ? lang : `${lang.language} (${lang.proficiency})`))
                .join(", ")
            : JSON.stringify(formData.languages || [])
        }
- Previously Worked: ${formData.previouslyWorked || "Not provided"}
- Work Details: ${formData.workDetails || "Not provided"}
- Relatives/Friends: ${formData.relativesOrFriends || "Not provided"}
- Relative Names: ${formData.relativeNames || formData.names || "Not provided"}
- Relationship: ${formData.selectedRelationship || "Not provided"}
- Source: RCC Career Portal (Automated Screening System)
- Portal URL: ${process.env.NEXT_PUBLIC_APP_URL || "https://careerelraceportal.vercel.app"}

EXPERIENCE SUMMARY:
${
  formData.experienceData
    ? Object.entries(formData.experienceData)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
    : "No experience data provided"
}

CURRENTLY WORKING STATUS:
${JSON.stringify(formData.currentlyWorkingStatus || {})}
        `.trim(),
      }

      // Only add job_id if we have a valid one
      if (validJobId) {
        applicantData.job_id = validJobId
        console.log("Using valid job_id:", validJobId)
      } else {
        console.log("Creating applicant without job_id (will be assigned manually)")
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

      return { success: true, applicantId, referenceNumber }
    } catch (error) {
      console.error("Error creating applicant:", error)
      throw error
    }
  }

  async uploadCV(applicantId: number, cvFile: File): Promise<void> {
    try {
      console.log("Uploading CV for applicant:", applicantId)
      console.log("CV file details:", {
        name: cvFile.name,
        size: cvFile.size,
        type: cvFile.type,
      })

      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (cvFile.size > maxSize) {
        console.error("File too large:", cvFile.size, "bytes (max:", maxSize, "bytes)")
        throw new Error("CV file is too large. Maximum size is 10MB.")
      }

      // Convert file to base64 string
      const arrayBuffer = await cvFile.arrayBuffer()
      const base64String = Buffer.from(arrayBuffer).toString("base64")

      console.log("Base64 string length:", base64String.length)

      // Create attachment using JSON-RPC with base64 string
      const attachmentData = {
        name: cvFile.name,
        datas: base64String, // Send as base64 string, not bytes
        res_model: "hr.applicant",
        res_id: applicantId,
        mimetype: cvFile.type || "application/pdf",
      }

      const attachmentPayload = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "object",
          method: "execute_kw",
          args: [ODOO_DB, this.uid, ODOO_PASSWORD, "ir.attachment", "create", [attachmentData]],
        },
        id: Math.floor(Math.random() * 1000000),
      }

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

      console.log("Uploading CV with attachment payload...")

      const uploadResponse = await fetch(`${ODOO_URL}/jsonrpc`, {
        method: "POST",
        headers,
        body: JSON.stringify(attachmentPayload),
      })

      console.log("CV upload response status:", uploadResponse.status)
      console.log("CV upload response headers:", Object.fromEntries(uploadResponse.headers.entries()))

      if (!uploadResponse.ok) {
        console.error("Failed to upload CV:", uploadResponse.status, uploadResponse.statusText)
        const errorText = await uploadResponse.text()
        console.error("CV upload error response:", errorText)
        throw new Error(`Failed to upload CV: ${uploadResponse.status} - ${errorText}`)
      }

      // Check if response is JSON
      const contentType = uploadResponse.headers.get("content-type")
      console.log("Response content type:", contentType)

      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await uploadResponse.text()
        console.error("Non-JSON response received:", responseText.substring(0, 500))
        throw new Error("Invalid response format from Odoo server")
      }

      let uploadData
      try {
        const responseText = await uploadResponse.text()
        console.log("Raw response text:", responseText.substring(0, 500))
        uploadData = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError)
        throw new Error("Invalid JSON response from Odoo server")
      }

      console.log("CV upload response:", uploadData)

      if (uploadData.error) {
        console.error("CV upload Odoo error:", uploadData.error)
        throw new Error(uploadData.error.data?.message || uploadData.error.message || "Failed to upload CV")
      }

      console.log("CV uploaded successfully with attachment ID:", uploadData.result)
    } catch (error) {
      console.error("Error uploading CV:", error)
      // Don't throw here as the applicant was already created
      console.log("CV upload failed, but applicant was created successfully")
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
      console.log("Job title/name:", applicationData.jobTitle || applicationData.jobName || "Not provided")
      console.log("Screening data:", {
        score: applicationData.formData.screeningScore,
        percentage: applicationData.formData.screeningPercentage,
        matched: applicationData.formData.matchedRequirements,
      })
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

    // Validate that we have the required data
    if (!applicationData || !applicationData.jobId) {
      console.error("Invalid application data structure")
      return NextResponse.json(
        {
          success: false,
          error: "Invalid application data: missing jobId",
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

    // Create applicant (only qualified applications reach this point)
    console.log("Creating qualified applicant in Odoo...")
    const result = await odooService.createApplicant(applicationData, cvFile || undefined)

    console.log("Qualified application submitted successfully:", result)

    return NextResponse.json(
      {
        success: true,
        message: "Qualified application submitted successfully to Odoo",
        applicantId: result.applicantId,
        referenceNumber: result.referenceNumber,
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
