"use client"

import { useState } from "react"
import { screeningService, type ScreeningResult } from "../services/screeningService"

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

  // Additional fields for screening
  education?: string
  certifications?: string
}

export interface ApplicationSubmissionResult {
  success: boolean
  qualified?: boolean
  screeningResult?: ScreeningResult
  applicantId?: number
  referenceNumber?: string // Add reference number to result interface
  error?: string
  message?: string
}

export function useJobApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isScreening, setIsScreening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null)

  const submitApplication = async (
    jobId: string,
    applicationData: JobApplicationData,
    cvFile?: File,
    jobTitle?: string,
    jobName?: string,
  ): Promise<ApplicationSubmissionResult> => {
    setIsSubmitting(true)
    setIsScreening(true)
    setError(null)
    setScreeningResult(null)

    try {
      console.log("🚀 Starting application submission process...")
      console.log("Job ID:", jobId)
      console.log("Job title/name:", jobTitle || jobName || "Not provided")
      console.log(
        "[v0] CV file received in submitApplication:",
        cvFile
          ? {
              name: cvFile.name,
              size: cvFile.size,
              type: cvFile.type,
            }
          : "No CV file provided",
      )

      // Validate required data
      if (!jobId || !applicationData) {
        throw new Error("Missing required data: jobId and applicationData are required")
      }

      const jobReferenceNumber = localStorage.getItem("jobReferenceNumber") || ""
      console.log("Job reference number:", jobReferenceNumber)

      // Step 1: Extract CV content if available
      let cvContent = ""
      if (cvFile) {
        console.log("📄 Extracting CV content...")
        cvContent = await screeningService.extractCVContent(cvFile)
        console.log("[v0] CV content extracted, length:", cvContent.length)
      }

      // Step 2: Screen the application
      console.log("🔍 Screening application against job requirements...")
      const screening = await screeningService.screenApplication(
        { formData: applicationData, ...applicationData },
        cvContent,
      )

      setScreeningResult(screening)
      setIsScreening(false)

      console.log(`📊 Screening completed: ${screening.percentage}% match`)
      console.log(`✅ Qualified: ${screening.qualified}`)

      // Step 3: Decide whether to submit to Odoo or reject
      if (!screening.qualified) {
        console.log("❌ Application does not meet minimum requirements")
        return {
          success: false,
          qualified: false,
          screeningResult: screening,
          message: screening.feedback,
        }
      }

      // Step 4: Submit to Odoo if qualified
      console.log("✅ Application qualified, submitting to Odoo...")

      const formData = new FormData()

      const payload = {
        jobId,
        jobTitle,
        jobName,
        jobReferenceNumber, // Include job reference number
        formData: {
          ...applicationData,
          // Add screening metadata to the application
          screeningScore: screening.score,
          screeningPercentage: screening.percentage,
          matchedRequirements: screening.matchedRequirements.join(", "),
          screeningDate: new Date().toISOString(),
        },
      }

      formData.append("data", JSON.stringify(payload))

      // Add CV file if provided
      if (cvFile) {
        formData.append("cv", cvFile)
        console.log("📎 CV file attached:", cvFile.name, cvFile.size, "bytes")
        console.log("[v0] FormData keys after appending CV:", Array.from(formData.keys()))
        console.log("[v0] CV file in FormData:", formData.get("cv"))
      } else {
        console.log("[v0] No CV file to attach")
      }

      console.log("📤 Sending qualified application to Odoo...")

      const response = await fetch("/api/odoo/apply", {
        method: "POST",
        body: formData,
      })

      console.log("📥 Odoo API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Odoo API error:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("✅ Odoo submission successful:", result)

      if (!result.success) {
        throw new Error(result.error || "Application submission failed")
      }

      return {
        success: true,
        qualified: true,
        screeningResult: screening,
        applicantId: result.applicantId,
        referenceNumber: result.referenceNumber,
        message: `Application submitted successfully! ${screening.feedback}`,
      }
    } catch (error) {
      console.error("❌ Error in application submission:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)

      return {
        success: false,
        qualified: screeningResult?.qualified,
        screeningResult: screeningResult || undefined,
        error: errorMessage,
      }
    } finally {
      setIsSubmitting(false)
      setIsScreening(false)
    }
  }

  const testConnection = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("🔍 Testing API connection...")

      const response = await fetch("/api/odoo/apply", {
        method: "GET",
      })

      console.log("📥 Test response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("✅ Connection test successful:", result)

      return { success: true }
    } catch (error) {
      console.error("❌ Connection test failed:", error)
      const errorMessage = error instanceof Error ? error.message : "Connection test failed"

      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  // Method to manually screen an application (for testing)
  const screenApplication = async (applicationData: JobApplicationData, cvFile?: File): Promise<ScreeningResult> => {
    setIsScreening(true)
    try {
      let cvContent = ""
      if (cvFile) {
        cvContent = await screeningService.extractCVContent(cvFile)
      }

      const result = await screeningService.screenApplication(
        { formData: applicationData, ...applicationData },
        cvContent,
      )

      setScreeningResult(result)
      return result
    } finally {
      setIsScreening(false)
    }
  }

  return {
    submitApplication,
    testConnection,
    screenApplication,
    isSubmitting,
    isScreening,
    error,
    screeningResult,
  }
}
