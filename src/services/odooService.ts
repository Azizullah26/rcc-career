interface OdooConfig {
  url: string
  database: string
  username: string
  password: string
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

export class OdooService {
  private config: OdooConfig
  private sessionId: string | null = null
  private uid: number | null = null

  constructor() {
    this.config = {
      url: process.env.NEXT_PUBLIC_ODOO_URL || "https://test.elrace.com",
      database: process.env.NEXT_PUBLIC_ODOO_DATABASE || "test.elrace.com",
      username: process.env.NEXT_PUBLIC_ODOO_USERNAME || "aziz@elrace.com",
      password: process.env.NEXT_PUBLIC_ODOO_PASSWORD || "1111",
    }
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
      // First authenticate
      const authResult = await this.authenticate()
      if (!authResult.success) {
        return { success: false, error: authResult.error }
      }

      // Prepare form data for API
      const formData = new FormData()
      formData.append("applicationData", JSON.stringify(applicationData))

      if (cvFile) {
        formData.append("cv", cvFile)
      }

      // Submit to our API endpoint
      const response = await fetch("/api/odoo/apply", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.details || errorData.error || "Failed to submit application",
        }
      }

      const result = await response.json()
      return {
        success: true,
        applicantId: result.applicantId,
      }
    } catch (error) {
      console.error("Error submitting job application:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/odoo/apply", {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.details || errorData.error || "Connection test failed",
        }
      }

      const result = await response.json()
      return {
        success: result.connection?.success || false,
        error: result.connection?.error,
      }
    } catch (error) {
      console.error("Connection test error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async getJobPositions(): Promise<{ success: boolean; jobs?: any[]; error?: string }> {
    try {
      const authResult = await this.authenticate()
      if (!authResult.success) {
        return { success: false, error: authResult.error }
      }

      const response = await fetch(`${this.config.url}/web/dataset/call_kw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session_id=${this.sessionId}`,
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: {
            model: "hr.job",
            method: "search_read",
            args: [
              [["state", "=", "recruit"]], // Only active job positions
              ["id", "name", "description", "department_id", "company_id"],
            ],
            kwargs: {},
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

      if (data.result) {
        return {
          success: true,
          jobs: data.result,
        }
      }

      return {
        success: false,
        error: data.error?.message || "Failed to fetch job positions",
      }
    } catch (error) {
      console.error("Error fetching job positions:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Utility method to format application data for Odoo
  formatApplicationForOdoo(applicationData: JobApplicationData) {
    return {
      name: `${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}`,
      partner_name: `${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}`,
      email_from: applicationData.personalInfo.email,
      partner_phone: applicationData.personalInfo.phone,
      job_id: Number.parseInt(applicationData.jobId),

      // Custom fields (these need to be defined in the Odoo module)
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
      x_portal_url: "https://careerrccv4.vercel.app",

      // Experience summary
      x_experience_summary: applicationData.experiences
        .map((exp) => `${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}`)
        .join("\n\n"),
    }
  }
}

// Export a singleton instance
export const odooService = new OdooService()

// Export types for use in components
export type { JobApplicationData, OdooConfig }
