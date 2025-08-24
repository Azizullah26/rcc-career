import { type NextRequest, NextResponse } from "next/server"
import { Buffer } from "buffer"

// Add runtime configuration for Vercel
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface JobApplicationData {
  jobId: string
  jobTitle?: string
  jobName?: string
  formData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    nationality: string
    gender: string
    maritalStatus: string
    totalExperience: string
    uaeExperience: string
    currentLocation: string
    expectedSalary: string
    joiningPossibility: string
    uaeDrivingLicense: boolean
    relocationPossibility: boolean
    languages: Array<{
      language: string
      proficiency: string
    }>
    previouslyWorked: boolean
    workDetails: string
    relativesOrFriends: boolean
    relativeNames: string
    relationships: any[]
    experienceData: Array<{
      company: string
      position: string
      duration: string
      responsibilities: string
      currentlyWorking: boolean
    }>
  }
  cvFile?: File
}

class OdooService {
  private baseUrl: string
  private db: string
  private username: string
  private password: string
  private sessionId: string | null = null

  constructor() {
    this.baseUrl = process.env.ODOO_URL || "https://erp.elrace.com"
    this.db = process.env.ODOO_DB || process.env.NEXT_PUBLIC_ODOO_DB || "odoo.elrace.com"
    this.username = process.env.ODOO_USERNAME || "jawad"
    this.password = process.env.ODOO_PASSWORD || "272127212721"
  }

  private async authenticate(): Promise<boolean> {
    try {
      console.log("🔐 Authenticating with Odoo...")
      console.log("Base URL:", this.baseUrl)
      console.log("Database:", this.db)
      console.log("Username:", this.username)

      const authUrl = `${this.baseUrl}/web/session/authenticate`

      const authData = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          db: this.db,
          login: this.username,
          password: this.password,
        },
        id: Math.floor(Math.random() * 1000000),
      }

      const response = await fetch(authUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(authData),
      })

      if (!response.ok) {
        console.error("❌ Authentication failed - HTTP Status:", response.status)
        const errorText = await response.text()
        console.error("Error response:", errorText)
        return false
      }

      const result = await response.json()
      console.log("🔍 Authentication response:", JSON.stringify(result, null, 2))

      if (result.error) {
        console.error("❌ Authentication error:", result.error)
        return false
      }

      if (result.result && result.result.uid) {
        this.sessionId = response.headers.get("set-cookie") || "authenticated"
        console.log("✅ Authentication successful, User ID:", result.result.uid)
        return true
      }

      console.error("❌ Authentication failed - No UID in response")
      return false
    } catch (error) {
      console.error("❌ Authentication error:", error)
      return false
    }
  }

  private async getValidJobId(requestedJobId: string): Promise<number | null> {
    try {
      console.log(`🔍 Searching for job with ID: ${requestedJobId}`)

      const searchUrl = `${this.baseUrl}/web/dataset/call_kw`

      const searchData = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "hr.job",
          method: "search_read",
          args: [
            [
              ["id", "=", Number.parseInt(requestedJobId)],
              ["state", "!=", "recruit"],
            ],
            ["id", "name", "state"],
          ],
          kwargs: {},
        },
        id: Math.floor(Math.random() * 1000000),
      }

      const response = await fetch(searchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: this.sessionId || "",
        },
        body: JSON.stringify(searchData),
      })

      if (!response.ok) {
        console.error("❌ Job search failed - HTTP Status:", response.status)
        return null
      }

      const result = await response.json()

      if (result.error) {
        console.error("❌ Job search error:", result.error)
        return null
      }

      if (result.result && result.result.length > 0) {
        const job = result.result[0]
        console.log(`✅ Found job: ${job.name} (ID: ${job.id}, State: ${job.state})`)
        return job.id
      }

      // If specific job not found, try to get any available job
      console.log("⚠️ Requested job not found, searching for any available job...")

      const fallbackData = {
        ...searchData,
        params: {
          ...searchData.params,
          args: [[["state", "=", "recruit"]], ["id", "name", "state"]],
        },
      }

      const fallbackResponse = await fetch(searchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: this.sessionId || "",
        },
        body: JSON.stringify(fallbackData),
      })

      if (fallbackResponse.ok) {
        const fallbackResult = await fallbackResponse.json()
        if (fallbackResult.result && fallbackResult.result.length > 0) {
          const fallbackJob = fallbackResult.result[0]
          console.log(`✅ Using fallback job: ${fallbackJob.name} (ID: ${fallbackJob.id})`)
          return fallbackJob.id
        }
      }

      console.log("❌ No valid jobs found")
      return null
    } catch (error) {
      console.error("❌ Error searching for job:", error)
      return null
    }
  }

  async uploadCV(
    applicantId: number,
    cvFile: File,
  ): Promise<{ success: boolean; attachmentId?: number; error?: string }> {
    try {
      console.log(`📎 Starting CV upload for applicant ${applicantId}`)
      console.log(`File details: ${cvFile.name}, Size: ${cvFile.size} bytes, Type: ${cvFile.type}`)

      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (cvFile.size > maxSize) {
        console.error(`❌ File too large: ${cvFile.size} bytes (max: ${maxSize} bytes)`)
        return { success: false, error: "File too large. Maximum size is 10MB." }
      }

      // Convert file to base64
      const arrayBuffer = await cvFile.arrayBuffer()
      const base64Data = Buffer.from(arrayBuffer).toString("base64")

      console.log(`📄 File converted to base64, length: ${base64Data.length}`)

      const attachmentUrl = `${this.baseUrl}/web/dataset/call_kw`

      const attachmentData = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "ir.attachment",
          method: "create",
          args: [
            {
              name: cvFile.name,
              datas: base64Data,
              res_model: "hr.applicant",
              res_id: applicantId,
              mimetype: cvFile.type,
              description: "CV uploaded from RCC Career Portal",
            },
          ],
          kwargs: {},
        },
        id: Math.floor(Math.random() * 1000000),
      }

      console.log("📤 Sending CV upload request to Odoo...")

      const response = await fetch(attachmentUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: this.sessionId || "",
        },
        body: JSON.stringify(attachmentData),
      })

      console.log(`📥 CV upload response status: ${response.status}`)
      console.log(`📥 Response headers:`, Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        console.error(`❌ CV upload failed - HTTP Status: ${response.status}`)
        const errorText = await response.text()
        console.error("Error response:", errorText.substring(0, 500))
        return { success: false, error: `Upload failed with status ${response.status}` }
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ Response is not JSON, content-type:", contentType)
        const responseText = await response.text()
        console.error("Response text:", responseText.substring(0, 500))
        return { success: false, error: "Server returned non-JSON response" }
      }

      const responseText = await response.text()
      console.log("📄 Raw response:", responseText.substring(0, 500))

      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error("❌ Failed to parse JSON response:", parseError)
        console.error("Response text:", responseText.substring(0, 500))
        return { success: false, error: "Invalid JSON response from server" }
      }

      if (result.error) {
        console.error("❌ CV upload error from Odoo:", result.error)
        return { success: false, error: result.error.message || "Upload failed" }
      }

      if (result.result) {
        console.log(`✅ CV uploaded successfully, attachment ID: ${result.result}`)
        return { success: true, attachmentId: result.result }
      }

      console.error("❌ Unexpected response format:", result)
      return { success: false, error: "Unexpected response format" }
    } catch (error) {
      console.error("❌ Error uploading CV:", error)
      return { success: false, error: `Upload error: ${error instanceof Error ? error.message : "Unknown error"}` }
    }
  }

  async createApplicant(
    applicationData: JobApplicationData,
  ): Promise<{ success: boolean; applicantId?: number; error?: string }> {
    try {
      console.log("🚀 Starting job application creation...")
      console.log("Job ID requested:", applicationData.jobId)
      console.log("Job Title:", applicationData.jobTitle || applicationData.jobName || "Not provided")

      // Authenticate first
      const isAuthenticated = await this.authenticate()
      if (!isAuthenticated) {
        return { success: false, error: "Authentication failed" }
      }

      // Get valid job ID
      const validJobId = await this.getValidJobId(applicationData.jobId)

      const createUrl = `${this.baseUrl}/web/dataset/call_kw`

      const jobTitle = applicationData.jobTitle || applicationData.jobName || `Job ID: ${applicationData.jobId}`

      const applicantData = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "hr.applicant",
          method: "create",
          args: [
            {
              name: `${applicationData.formData.firstName} ${applicationData.formData.lastName}`,
              email_from: applicationData.formData.email,
              partner_phone: applicationData.formData.phone,
              job_id: validJobId,

              // Personal Information
              x_date_of_birth: applicationData.formData.dateOfBirth,
              x_nationality: applicationData.formData.nationality,
              x_gender: applicationData.formData.gender,
              x_marital_status: applicationData.formData.maritalStatus,

              // Experience Information
              x_total_experience: applicationData.formData.totalExperience,
              x_uae_experience: applicationData.formData.uaeExperience,
              x_current_location: applicationData.formData.currentLocation,
              x_expected_salary: applicationData.formData.expectedSalary,
              x_joining_possibility: applicationData.formData.joiningPossibility,

              // Additional Information
              x_uae_driving_license: applicationData.formData.uaeDrivingLicense,
              x_relocation_possibility: applicationData.formData.relocationPossibility,
              x_languages: JSON.stringify(applicationData.formData.languages),

              // Application Questions
              x_previously_worked: applicationData.formData.previouslyWorked,
              x_work_details: applicationData.formData.workDetails,
              x_relatives_friends: applicationData.formData.relativesOrFriends,
              x_relative_names: applicationData.formData.relativeNames,
              x_relationships: JSON.stringify(applicationData.formData.relationships),

              // Experience Data
              x_experience_data: JSON.stringify(applicationData.formData.experienceData),

              // Source Information
              x_source_website: "RCC Career Portal",
              description: `Applied for Job: ${jobTitle}\nJob ID: ${applicationData.jobId}\nPortal URL: ${process.env.NEXT_PUBLIC_APP_URL || "https://careerelraceportal.vercel.app"}\nSubmitted: ${new Date().toISOString()}`,
            },
          ],
          kwargs: {},
        },
        id: Math.floor(Math.random() * 1000000),
      }

      console.log("📤 Sending applicant creation request...")

      const response = await fetch(createUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: this.sessionId || "",
        },
        body: JSON.stringify(applicantData),
      })

      if (!response.ok) {
        console.error("❌ Applicant creation failed - HTTP Status:", response.status)
        const errorText = await response.text()
        console.error("Error response:", errorText)
        return { success: false, error: `Failed to create applicant: HTTP ${response.status}` }
      }

      const result = await response.json()
      console.log("📥 Applicant creation response:", JSON.stringify(result, null, 2))

      if (result.error) {
        console.error("❌ Applicant creation error:", result.error)
        return { success: false, error: result.error.message || "Failed to create applicant" }
      }

      if (result.result) {
        const applicantId = result.result
        console.log(`✅ Applicant created successfully with ID: ${applicantId}`)

        // Upload CV if provided
        if (applicationData.cvFile) {
          console.log("📎 Uploading CV...")
          const uploadResult = await this.uploadCV(applicantId, applicationData.cvFile)
          if (!uploadResult.success) {
            console.warn("⚠️ CV upload failed, but applicant was created:", uploadResult.error)
            // Don't fail the entire process if CV upload fails
          } else {
            console.log("✅ CV uploaded successfully")
          }
        }

        return { success: true, applicantId }
      }

      console.error("❌ Unexpected response format:", result)
      return { success: false, error: "Unexpected response from server" }
    } catch (error) {
      console.error("❌ Error creating applicant:", error)
      return {
        success: false,
        error: `Application submission failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    }
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

// Handle GET requests
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "RCC Career Portal API",
    status: "active",
    endpoints: {
      POST: "/api/odoo/apply - Submit job application",
    },
  })
}

// Handle POST requests
export async function POST(request: NextRequest) {
  try {
    console.log("📨 Received job application request")

    // Parse form data
    const formData = await request.formData()

    // Extract application data
    const applicationDataStr = formData.get("applicationData") as string
    if (!applicationDataStr) {
      console.error("❌ No application data provided")
      return NextResponse.json({ success: false, error: "No application data provided" }, { status: 400 })
    }

    let applicationData: JobApplicationData
    try {
      applicationData = JSON.parse(applicationDataStr)
    } catch (error) {
      console.error("❌ Invalid JSON in application data:", error)
      return NextResponse.json({ success: false, error: "Invalid application data format" }, { status: 400 })
    }

    // Extract CV file if provided
    const cvFile = formData.get("cvFile") as File | null
    if (cvFile) {
      applicationData.cvFile = cvFile
      console.log(`📎 CV file received: ${cvFile.name} (${cvFile.size} bytes)`)
    }

    // Validate required fields
    if (!applicationData.jobId || !applicationData.formData) {
      console.error("❌ Missing required fields")
      return NextResponse.json(
        { success: false, error: "Missing required fields: jobId and formData are required" },
        { status: 400 },
      )
    }

    console.log("✅ Application data validated successfully")

    // Create Odoo service and submit application
    const odooService = new OdooService()
    const result = await odooService.createApplicant(applicationData)

    if (result.success) {
      console.log("🎉 Application submitted successfully!")
      return NextResponse.json({
        success: true,
        message: "Application submitted successfully",
        applicantId: result.applicantId,
      })
    } else {
      console.error("❌ Application submission failed:", result.error)
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Unexpected error in POST handler:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Application submission failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
