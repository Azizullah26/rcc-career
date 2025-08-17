import { type NextRequest, NextResponse } from "next/server"

const ODOO_URL = process.env.ODOO_URL || "https://test.elrace.com"
const ODOO_DB = process.env.ODOO_DB || "your_database_name"
const ODOO_USERNAME = process.env.ODOO_USERNAME || "aziz@elrace.com"
const ODOO_PASSWORD = process.env.ODOO_PASSWORD || "1111"

interface OdooAuthResponse {
  uid: number
  session_id: string
}

interface JobApplicationData {
  jobId: string
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    nationality: string
    gender: string
    maritalStatus: string
  }
  experienceInfo: {
    totalExperience: string
    uaeExperience: string
    currentLocation: string
    expectedSalary: string
    joiningPossibility: string
  }
  additionalInfo: {
    uaeDrivingLicense: boolean
    relocationPossibility: boolean
    languages: string[]
  }
  applicationQuestions: {
    previouslyWorked: boolean
    relativesOrFriends: boolean
    workDetails?: string
    relativeNames?: string
  }
  experiences: Array<{
    jobTitle: string
    company: string
    startDate: string
    endDate: string
    description: string
  }>
}

class OdooService {
  private sessionId: string | null = null
  private uid: number | null = null

  async authenticate(): Promise<boolean> {
    try {
      console.log("Authenticating with Odoo...")

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

      if (!authResponse.ok) {
        console.error("Authentication failed:", authResponse.status, authResponse.statusText)
        return false
      }

      const authData = await authResponse.json()
      console.log("Auth response:", authData)

      if (authData.result && authData.result.uid) {
        this.uid = authData.result.uid
        this.sessionId = authData.result.session_id
        console.log("Authentication successful, UID:", this.uid)
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
    if (!this.uid || !this.sessionId) {
      throw new Error("Not authenticated")
    }

    try {
      console.log("Creating applicant in Odoo...")

      // Prepare applicant data
      const applicantData = {
        name: `${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}`,
        partner_name: `${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}`,
        email_from: applicationData.personalInfo.email,
        partner_phone: applicationData.personalInfo.phone,
        job_id: Number.parseInt(applicationData.jobId),

        // Custom fields
        x_date_of_birth: applicationData.personalInfo.dateOfBirth,
        x_nationality: applicationData.personalInfo.nationality,
        x_gender: applicationData.personalInfo.gender,
        x_marital_status: applicationData.personalInfo.maritalStatus,
        x_total_experience: applicationData.experienceInfo.totalExperience,
        x_uae_experience: applicationData.experienceInfo.uaeExperience,
        x_current_location: applicationData.experienceInfo.currentLocation,
        x_expected_salary: applicationData.experienceInfo.expectedSalary,
        x_joining_possibility: applicationData.experienceInfo.joiningPossibility,
        x_uae_driving_license: applicationData.additionalInfo.uaeDrivingLicense,
        x_relocation_possibility: applicationData.additionalInfo.relocationPossibility,
        x_languages: applicationData.additionalInfo.languages.join(", "),
        x_previously_worked: applicationData.applicationQuestions.previouslyWorked,
        x_relatives_friends: applicationData.applicationQuestions.relativesOrFriends,
        x_work_details: applicationData.applicationQuestions.workDetails || "",
        x_relative_names: applicationData.applicationQuestions.relativeNames || "",
        x_source_website: "RCC Career Portal",
        x_portal_url: process.env.NEXT_PUBLIC_APP_URL || "https://careerrccv4.vercel.app",

        // Experience summary
        x_experience_summary: applicationData.experiences
          .map((exp) => `${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}`)
          .join("\n\n"),
      }

      console.log("Applicant data prepared:", applicantData)

      const createResponse = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${this.sessionId}`,
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: {
            model: "hr.applicant",
            method: "create",
            args: [applicantData],
            kwargs: {},
          },
          id: Math.floor(Math.random() * 1000000),
        }),
      })

      if (!createResponse.ok) {
        console.error("Failed to create applicant:", createResponse.status, createResponse.statusText)
        throw new Error("Failed to create applicant")
      }

      const createData = await createResponse.json()
      console.log("Create response:", createData)

      if (createData.error) {
        console.error("Odoo error:", createData.error)
        throw new Error(createData.error.data?.message || "Failed to create applicant")
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

      const uploadResponse = await fetch(`${ODOO_URL}/web/binary/upload_attachment`, {
        method: "POST",
        headers: {
          Cookie: `session_id=${this.sessionId}`,
        },
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

      const data = await response.json()
      return {
        success: response.ok,
        data: data,
        url: ODOO_URL,
        status: response.status,
      }
    } catch (error) {
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

    const odooService = new OdooService()
    const connectionTest = await odooService.testConnection()

    const response = {
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
    return NextResponse.json(response)
  } catch (error) {
    console.error("GET request error:", error)
    return NextResponse.json(
      {
        error: "Failed to test connection",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// POST endpoint for job applications
export async function POST(request: NextRequest) {
  try {
    console.log("=== POST /api/odoo/apply - Job Application Submission ===")
    console.log("Request URL:", request.url)
    console.log("Request method:", request.method)

    const formData = await request.formData()
    const applicationDataString = formData.get("applicationData") as string
    const cvFile = formData.get("cv") as File | null

    console.log("Form data keys:", Array.from(formData.keys()))
    console.log("Application data string length:", applicationDataString?.length || 0)
    console.log("CV file:", cvFile ? `${cvFile.name} (${cvFile.size} bytes)` : "No CV file")

    if (!applicationDataString) {
      console.error("Missing application data")
      return NextResponse.json({ error: "Missing application data" }, { status: 400 })
    }

    let applicationData: JobApplicationData
    try {
      applicationData = JSON.parse(applicationDataString)
      console.log("Application data parsed successfully for job:", applicationData.jobId)
    } catch (parseError) {
      console.error("Failed to parse application data:", parseError)
      return NextResponse.json({ error: "Invalid application data format" }, { status: 400 })
    }

    const odooService = new OdooService()

    // Authenticate with Odoo
    console.log("Authenticating with Odoo...")
    const authenticated = await odooService.authenticate()
    if (!authenticated) {
      console.error("Odoo authentication failed")
      return NextResponse.json({ error: "Failed to authenticate with Odoo" }, { status: 500 })
    }

    // Create applicant
    console.log("Creating applicant in Odoo...")
    const result = await odooService.createApplicant(applicationData, cvFile || undefined)

    console.log("Application submitted successfully:", result)

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully to Odoo",
      applicantId: result.applicantId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error processing job application:", error)

    return NextResponse.json(
      {
        error: "Failed to submit application",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
