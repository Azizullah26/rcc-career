"use client"

import { useState } from "react"

interface JobApplicationData {
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

export const useJobApplication = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitApplication = async (
    applicationData: JobApplicationData,
    cvFile?: File,
    jobTitle?: string,
    jobName?: string,
  ) => {
    setIsSubmitting(true)
    setError(null)

    try {
      console.log("🚀 Submitting job application...")
      console.log("Job ID:", applicationData.jobId)
      console.log("Job Title:", jobTitle || jobName || "Not provided")
      console.log("Form data keys:", Object.keys(applicationData.formData))
      console.log("CV file:", cvFile ? `${cvFile.name} (${cvFile.size} bytes)` : "None")

      // Prepare form data for submission
      const submitFormData = new FormData()

      // Add application data as JSON string
      const dataWithJobInfo = {
        ...applicationData,
        jobTitle: jobTitle || applicationData.jobTitle,
        jobName: jobName || applicationData.jobName,
      }

      submitFormData.append("applicationData", JSON.stringify(dataWithJobInfo))

      // Add CV file if provided
      if (cvFile) {
        submitFormData.append("cvFile", cvFile)
      }

      console.log("📤 Sending request to API...")

      // Submit to API
      const response = await fetch("/api/odoo/apply", {
        method: "POST",
        body: submitFormData,
      })

      console.log("📥 API response status:", response.status)
      console.log("📥 API response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ API request failed:", response.status, errorText)
        throw new Error(`Application submission failed: HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("📋 API response:", result)

      if (result.success) {
        console.log("✅ Application submitted successfully!")
        return {
          success: true,
          applicantId: result.applicantId,
          message: result.message || "Application submitted successfully",
        }
      } else {
        console.error("❌ Application submission failed:", result.error)
        throw new Error(result.error || "Application submission failed")
      }
    } catch (error) {
      console.error("❌ Error submitting application:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitApplication,
    isSubmitting,
    error,
  }
}
