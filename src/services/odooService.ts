const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://careerelraceportal.vercel.app"

interface JobPosition {
  id: number
  name: string
  department: string
  location: string
  description: string
  requirements: string
}

interface ApplicationData {
  jobId: string
  formData: any
  cvFile?: File
}

export class OdooService {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_BASE_URL
  }

  async getJobPositions(): Promise<JobPosition[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/odoo/jobs`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        return data.jobs || []
      } else {
        throw new Error(data.error || "Failed to fetch job positions")
      }
    } catch (error) {
      console.error("Error fetching job positions:", error)
      throw error
    }
  }

  async submitApplication(
    applicationData: ApplicationData,
  ): Promise<{ success: boolean; applicantId?: number; error?: string }> {
    try {
      const formData = new FormData()
      formData.append("applicationData", JSON.stringify(applicationData))

      if (applicationData.cvFile) {
        formData.append("cvFile", applicationData.cvFile)
      }

      const response = await fetch(`${this.baseUrl}/api/odoo/apply`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error submitting application:", error)
      throw error
    }
  }
}

export const odooService = new OdooService()
