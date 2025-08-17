const ODOO_CONFIG = {
  url: process.env.NEXT_PUBLIC_ODOO_URL || "https://test.elrace.com",
  database: process.env.NEXT_PUBLIC_ODOO_DB || "your_database_name",
  username: process.env.NEXT_PUBLIC_ODOO_USERNAME || "aziz@elrace.com",
  password: process.env.NEXT_PUBLIC_ODOO_PASSWORD || "1111",
}

export interface JobApplicationData {
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

export class OdooService {
  private config = ODOO_CONFIG

  async submitApplication(applicationData: JobApplicationData, cvFile?: File): Promise<any> {
    try {
      const formData = new FormData()
      formData.append("applicationData", JSON.stringify(applicationData))

      if (cvFile) {
        formData.append("cv", cvFile)
      }

      const response = await fetch("/api/odoo/apply", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to submit application")
      }

      return await response.json()
    } catch (error) {
      console.error("Error submitting application:", error)
      throw error
    }
  }

  async testConnection(): Promise<any> {
    try {
      const response = await fetch("/api/odoo/apply", {
        method: "GET",
      })

      return await response.json()
    } catch (error) {
      console.error("Error testing connection:", error)
      throw error
    }
  }

  async getJobs(): Promise<any> {
    try {
      // This would be implemented when you need to fetch jobs from Odoo
      // For now, return mock data or implement based on your needs
      return []
    } catch (error) {
      console.error("Error fetching jobs:", error)
      throw error
    }
  }
}

export const odooService = new OdooService()
