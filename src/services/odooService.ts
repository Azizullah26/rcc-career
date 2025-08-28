"use client"

interface OdooConfig {
  url: string
  database: string
  username: string
  password: string
}

export interface JobApplicationData {
  jobId: string
  jobTitle?: string
  jobName?: string
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

interface OdooResponse {
  jsonrpc: string
  id?: number
  result?: any
  error?: {
    code: number
    message: string
    data?: any
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://careerelraceportal.vercel.app"

export class OdooService {
  private baseUrl: string
  private config: OdooConfig
  private sessionId: string | null = null
  private uid: number | null = null

  constructor() {
    this.config = {
      url: process.env.NEXT_PUBLIC_ODOO_URL || "https://erp.elrace.com",
      database: process.env.NEXT_PUBLIC_ODOO_DATABASE || "odoo.elrace.com",
      username: process.env.NEXT_PUBLIC_ODOO_USERNAME || "jawad",
      password: process.env.NEXT_PUBLIC_ODOO_PASSWORD || "272127212721",
    }
    this.baseUrl = API_BASE_URL
  }

  async authenticate(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log("Authenticating with Odoo at:", this.config.url)

      const response = await fetch(`${this.config.url}/web/session/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: {
            db: this.config.database,
            login: this.config.username,
            password: this.config.password,
          },
          id: Math.floor(Math.random() * 1000000),
        }),
      })

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      const data: OdooResponse = await response.json()

      if (data.result && data.result.uid) {
        this.uid = data.result.uid
        this.sessionId = data.result.session_id
        console.log("Authentication successful")
        return { success: true }
      }

      return {
        success: false,
        error: data.error?.message || "Authentication failed",
      }
    } catch (error) {
      console.error("Authentication error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async submitJobApplication(
    applicationData: JobApplicationData,
    cvFile?: File,
  ): Promise<{ success: boolean; applicantId?: number; error?: string }> {
    try {
      console.log("🚀 Submitting job application to Odoo service")
      console.log("Base URL:", this.baseUrl)
      console.log("Job ID:", applicationData.jobId)

      const formData = new FormData()
      formData.append("applicationData", JSON.stringify(applicationData))

      if (cvFile) {
        formData.append("cvFile", cvFile)
        console.log("📎 CV file attached:", cvFile.name)
      }

      const response = await fetch(`${this.baseUrl}/api/odoo/apply`, {
        method: "POST",
        body: formData,
      })

      console.log("📥 Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Request failed:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("✅ Response received:", result)

      return result
    } catch (error) {
      console.error("❌ Error in submitJobApplication:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async testConnection(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      console.log("🔍 Testing Odoo connection")

      const response = await fetch(`${this.baseUrl}/api/odoo/apply`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("✅ Connection test successful:", data)

      return { success: true, data }
    } catch (error) {
      console.error("❌ Connection test failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Connection test failed",
      }
    }
  }

  async fetchJobs(): Promise<any[]> {
    try {
      console.log("Fetching job positions...")

      // This would be implemented when you have a jobs endpoint
      const response = await fetch(`${this.baseUrl}/api/odoo/jobs`, {
        method: "GET",
      })

      console.log("Fetch jobs response status:", response.status)
      console.log("Fetch jobs response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Fetch jobs success response:", result)

      return result
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
      return []
    }
  }

  // Utility method to format application data for Odoo
  formatApplicationForOdoo(applicationData: JobApplicationData) {
    // Safely handle potentially undefined/null data
    const safeData = applicationData || {}

    return {
      name: safeData.fullName || `${safeData.firstName || ""} ${safeData.lastName || ""}`.trim() || "Unknown Applicant",
      partner_name:
        safeData.fullName || `${safeData.firstName || ""} ${safeData.lastName || ""}`.trim() || "Unknown Applicant",
      email_from: safeData.email || "",
      partner_phone: safeData.phone || "",

      // Use standard description field instead of custom fields
      description: `
Application Details:
- Date of Birth: ${safeData.dateOfBirth || safeData.dob || "Not provided"}
- Nationality: ${safeData.nationality || "Not provided"}
- Gender: ${safeData.gender || "Not provided"}
- Marital Status: ${safeData.maritalStatus || "Not provided"}
- Total Experience: ${safeData.totalExperience || "Not provided"}
- UAE Experience: ${safeData.uaeExperience || "Not provided"}
- Egypt Experience: ${safeData.egyptExperience || "Not provided"}
- Current Location: ${safeData.currentLocation || "Not provided"}
- Expected Salary: ${safeData.expectedSalary || "Not provided"}
- Joining Possibility: ${safeData.joiningPossibility || "Not provided"}
- UAE Driving License: ${safeData.uaeDrivingLicense || "Not provided"}
- Egypt Driving License: ${safeData.egyptDrivingLicense || "Not provided"}
- Relocation Possibility: ${safeData.relocationPossibility || "Not provided"}
- Languages: ${Array.isArray(safeData.languages) ? safeData.languages.join(", ") : safeData.languages || "Not provided"}
- Previously Worked: ${safeData.previouslyWorked || "Not provided"}
- Work Details: ${safeData.workDetails || "Not provided"}
- Relatives/Friends: ${safeData.relativesOrFriends || "Not provided"}
- Relative Names: ${safeData.relativeNames || safeData.names || "Not provided"}
- Source: RCC Career Portal
- Portal URL: https://careerelraceportal.vercel.app

Experience Summary:
${safeData.experienceData ? Object.values(safeData.experienceData).join("\n\n") : "No experience data provided"}
      `.trim(),
    }
  }
}

export const odooService = new OdooService()

// Export types for use in components
export type { JobApplicationData }
