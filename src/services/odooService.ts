const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://careerelraceportal.vercel.app"

export interface JobApplicationData {
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
}

export class OdooService {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_BASE_URL
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
}

export const odooService = new OdooService()
