"use client"

interface OdooConfig {
  url: string
  database: string
  username: string
  password: string
}

export interface JobApplicationData {
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

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://careerrccv5.vercel.app"

export class OdooService {
  private baseUrl: string
  private config: OdooConfig
  private sessionId: string | null = null
  private uid: number | null = null

  constructor() {
    this.config = {
      url: process.env.NEXT_PUBLIC_ODOO_URL || "https://test.elrace.com",
      database: process.env.NEXT_PUBLIC_ODOO_DATABASE || "test.elrace.com",
      username: process.env.NEXT_PUBLIC_ODOO_USERNAME || "aziz",
      password: process.env.NEXT_PUBLIC_ODOO_PASSWORD || "aziz",
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

  async submitJobApplication(jobId: string, applicationData: JobApplicationData, cvFile?: File): Promise<any> {
    try {
      console.log("Submitting job application...")

      const formData = new FormData()

      // Add application data
      const payload = {
        jobId,
        formData: applicationData,
      }

      formData.append("data", JSON.stringify(payload))

      // Add CV file if provided
      if (cvFile) {
        formData.append("cv", cvFile)
      }

      console.log("Sending request to /api/odoo/apply")

      const response = await fetch(`${this.baseUrl}/api/odoo/apply`, {
        method: "POST",
        body: formData,
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Response not OK:", response.status, response.statusText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("Success response:", result)

      // Ensure we return a proper response object
      if (!result || typeof result.success === "undefined") {
        throw new Error("Invalid response format from server")
      }

      return result
    } catch (error) {
      console.error("Error submitting job application:", error)
      throw error
    }
  }

  async testConnection(): Promise<any> {
    try {
      console.log("Testing connection to API...")

      const response = await fetch(`${this.baseUrl}/api/odoo/apply`, {
        method: "GET",
      })

      console.log("Test response status:", response.status)
      console.log("Test response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Test success response:", result)

      return result
    } catch (error) {
      console.error("Connection test failed:", error)
      throw error
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
    return {
      name: applicationData.fullName || `${applicationData.firstName} ${applicationData.lastName}`,
      partner_name: applicationData.fullName || `${applicationData.firstName} ${applicationData.lastName}`,
      email_from: applicationData.email,
      partner_phone: applicationData.phone,
      job_id: Number.parseInt(applicationData.totalExperience),

      // Custom fields (these need to be defined in the Odoo module)
      x_date_of_birth: applicationData.dateOfBirth || applicationData.dob,
      x_nationality: applicationData.nationality,
      x_gender: applicationData.gender,
      x_marital_status: applicationData.maritalStatus,
      x_total_experience: applicationData.totalExperience,
      x_uae_experience: applicationData.uaeExperience,
      x_egypt_experience: applicationData.egyptExperience,
      x_current_location: applicationData.currentLocation,
      x_expected_salary: applicationData.expectedSalary,
      x_joining_possibility: applicationData.joiningPossibility,
      x_uae_driving_license: applicationData.uaeDrivingLicense,
      x_egypt_driving_license: applicationData.egyptDrivingLicense,
      x_relocation_possibility: applicationData.relocationPossibility,
      x_languages: Array.isArray(applicationData.languages)
        ? applicationData.languages.join(", ")
        : applicationData.languages,
      x_previously_worked: applicationData.previouslyWorked,
      x_work_details: applicationData.workDetails || "",
      x_relatives_friends: applicationData.relativesOrFriends,
      x_relative_names: applicationData.relativeNames || applicationData.names,
      x_source_website: "RCC Career Portal",
      x_portal_url: "https://careerrccv5.vercel.app",

      // Experience summary
      x_experience_summary: applicationData.experienceData
        ? Object.values(applicationData.experienceData).join("\n\n")
        : "",
    }
  }
}

// Export a singleton instance
export const odooService = new OdooService()

// Export types for use in components
export type { JobApplicationData }
