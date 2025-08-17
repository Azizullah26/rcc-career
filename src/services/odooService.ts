// Odoo API Service for Job Applications - RCC Career Portal
export interface OdooConfig {
  url: string
  database: string
  username: string
  password: string
}

export interface JobApplicationData {
  // Personal Information
  partner_name: string // Full Name
  email_from: string // Email Address
  partner_phone: string // Phone Number
  date_of_birth?: string // Date of Birth
  nationality?: string // Nationality
  gender?: string // Gender
  marital_status?: string // Marital Status

  // Job Related
  job_id: number // Job Position ID in Odoo
  name: string // Application Name/Subject
  description?: string // Cover letter or additional info

  // Experience
  total_experience?: string // Total Experience
  uae_experience?: string // UAE Experience
  current_location?: string // Current Location
  expected_salary?: string // Expected Salary
  joining_possibility?: string // Joining Possibility

  // Additional Info
  uae_driving_license?: boolean // UAE Driving License
  relocation_possibility?: boolean // Relocation Possibility
  languages?: string // Languages (JSON string)

  // Application Questions
  previously_worked?: boolean // Previously worked with company
  work_details?: string // Work details
  relatives_friends?: boolean // Relatives/Friends in company
  relative_names?: string // Names of relatives/friends
  relationships?: string // Relationship types

  // Experience Data
  experience_data?: string // JSON string of experience entries

  // System fields
  stage_id?: number // Application stage
  source_id?: number // Source of application
  portal_url?: string // Career portal URL
}

export interface OdooResponse {
  success: boolean
  data?: any
  error?: string
  applicant_id?: number
}

class OdooService {
  private config: OdooConfig
  private sessionId: string | null = null

  constructor(config: OdooConfig) {
    this.config = config
  }

  // Authenticate with RCC Odoo
  async authenticate(): Promise<boolean> {
    try {
      console.log("Authenticating with RCC Odoo:", this.config.url)

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
        }),
      })

      if (!response.ok) {
        console.error("HTTP error during authentication:", response.status)
        return false
      }

      const data = await response.json()

      if (data.result && data.result.uid) {
        this.sessionId = data.result.session_id
        console.log("Successfully authenticated with RCC Odoo")
        return true
      }

      console.error("Authentication failed:", data.error)
      return false
    } catch (error) {
      console.error("RCC Odoo authentication failed:", error)
      return false
    }
  }

  // Create job application in RCC Odoo
  async createJobApplication(applicationData: JobApplicationData): Promise<OdooResponse> {
    try {
      // Ensure we're authenticated
      if (!this.sessionId) {
        const authenticated = await this.authenticate()
        if (!authenticated) {
          return { success: false, error: "Authentication failed" }
        }
      }

      console.log("Creating job application in RCC Odoo...")

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
            model: "hr.applicant",
            method: "create",
            args: [applicationData],
            kwargs: {},
          },
        }),
      })

      if (!response.ok) {
        return { success: false, error: `HTTP error: ${response.status}` }
      }

      const data = await response.json()

      if (data.result) {
        console.log("Job application created successfully in RCC Odoo")
        return {
          success: true,
          data: data.result,
          applicant_id: data.result,
        }
      } else {
        return {
          success: false,
          error: data.error?.message || "Failed to create application",
        }
      }
    } catch (error) {
      console.error("Failed to create job application in RCC Odoo:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Upload CV file to RCC Odoo
  async uploadCV(applicantId: number, file: File): Promise<OdooResponse> {
    try {
      console.log("Uploading CV to RCC Odoo for applicant:", applicantId)

      // Convert file to base64
      const base64File = await this.fileToBase64(file)

      const attachmentData = {
        name: file.name,
        datas: base64File,
        res_model: "hr.applicant",
        res_id: applicantId,
        mimetype: file.type,
        description: "CV/Resume uploaded from RCC Career Portal",
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
            model: "ir.attachment",
            method: "create",
            args: [attachmentData],
            kwargs: {},
          },
        }),
      })

      if (!response.ok) {
        return { success: false, error: `HTTP error: ${response.status}` }
      }

      const data = await response.json()

      if (data.result) {
        console.log("CV uploaded successfully to RCC Odoo")
        return { success: true, data: data.result }
      } else {
        return {
          success: false,
          error: data.error?.message || "Failed to upload CV",
        }
      }
    } catch (error) {
      console.error("Failed to upload CV to RCC Odoo:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Get job positions from RCC Odoo
  async getJobPositions(): Promise<OdooResponse> {
    try {
      if (!this.sessionId) {
        const authenticated = await this.authenticate()
        if (!authenticated) {
          return { success: false, error: "Authentication failed" }
        }
      }

      console.log("Fetching job positions from RCC Odoo...")

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
              ["id", "name", "department_id", "description"],
            ],
            kwargs: {},
          },
        }),
      })

      if (!response.ok) {
        return { success: false, error: `HTTP error: ${response.status}` }
      }

      const data = await response.json()

      if (data.result) {
        console.log("Job positions fetched successfully from RCC Odoo")
        return { success: true, data: data.result }
      } else {
        return {
          success: false,
          error: data.error?.message || "Failed to fetch job positions",
        }
      }
    } catch (error) {
      console.error("Failed to fetch job positions from RCC Odoo:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Helper function to convert file to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result as string
        // Remove data:mime/type;base64, prefix
        const base64Data = base64.split(",")[1]
        resolve(base64Data)
      }
      reader.onerror = (error) => reject(error)
    })
  }
}

// RCC Odoo Environment configuration
const odooConfig: OdooConfig = {
  url: process.env.NEXT_PUBLIC_ODOO_URL || "https://test.elrace.com",
  database: process.env.NEXT_PUBLIC_ODOO_DATABASE || "test_elrace_db",
  username: process.env.NEXT_PUBLIC_ODOO_USERNAME || "aziz@elrace.com",
  password: process.env.NEXT_PUBLIC_ODOO_PASSWORD || "1111",
}

export const odooService = new OdooService(odooConfig)
