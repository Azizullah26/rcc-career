"use client"

import { useState } from "react"

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

export function useJobApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitApplication = async (jobId: string, applicationData: JobApplicationData, cvFile?: File) => {
    setIsSubmitting(true)
    setError(null)

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

      const response = await fetch("/api/odoo/apply", {
        method: "POST",
        body: formData,
      })

      console.log("API response status:", response.status)
      console.log("API response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API response error:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("API success response:", result)

      // Ensure we return a proper response object
      if (!result || typeof result.success === "undefined") {
        throw new Error("Invalid response format from server")
      }

      if (!result.success) {
        throw new Error(result.error || "Application submission failed")
      }

      return result
    } catch (error) {
      console.error("Error submitting application:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const testConnection = async () => {
    try {
      console.log("Testing connection to API...")

      const response = await fetch("/api/odoo/apply", {
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

  return {
    submitApplication,
    testConnection,
    isSubmitting,
    error,
  }
}
