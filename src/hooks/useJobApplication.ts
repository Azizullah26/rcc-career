"use client"

import { useState } from "react"

interface FormData {
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

interface UseJobApplicationReturn {
  isSubmitting: boolean
  submitApplication: (
    jobId: string,
    formData: FormData,
    cvFile?: File,
    jobTitle?: string,
    jobName?: string,
  ) => Promise<{ success: boolean; error?: string }>
}

export function useJobApplication(): UseJobApplicationReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitApplication = async (
    jobId: string,
    formData: FormData,
    cvFile?: File,
    jobTitle?: string,
    jobName?: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true)

    try {
      console.log("🚀 Submitting job application...")
      console.log("Job ID:", jobId)
      console.log("Job Title:", jobTitle || jobName || "Not provided")
      console.log("Form data keys:", Object.keys(formData))
      console.log("CV file:", cvFile ? `${cvFile.name} (${cvFile.size} bytes)` : "None")

      // Prepare form data for submission
      const submitFormData = new FormData()

      // Add application data as JSON string
      const applicationData = {
        jobId,
        jobTitle,
        jobName,
        formData,
      }

      submitFormData.append("applicationData", JSON.stringify(applicationData))

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

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ API request failed:", response.status, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("📋 API response:", result)

      if (result.success) {
        console.log("✅ Application submitted successfully!")
        return { success: true }
      } else {
        console.error("❌ Application submission failed:", result.error)
        return { success: false, error: result.error || "Application submission failed" }
      }
    } catch (error) {
      console.error("❌ Error submitting application:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      return { success: false, error: `Application submission failed: ${errorMessage}` }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    submitApplication,
  }
}
