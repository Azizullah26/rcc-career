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

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://careerelraceportal.vercel.app"

export const odooService = {
  async submitApplication(data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/odoo/apply`, {
        method: "POST",
        body: data,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error submitting application:", error)
      throw error
    }
  },

  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/odoo/apply`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error testing connection:", error)
      throw error
    }
  },
}

// Export types for use in components
export type { JobApplicationData }
