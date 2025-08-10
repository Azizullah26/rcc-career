"use client"

import { useState } from "react"

export interface JobApplicationData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string
  gender: string
  maritalStatus: string

  // Experience Information
  totalExperience: string
  uaeExperience: string
  currentLocation: string
  expectedSalary: string
  joiningPossibility: string

  // Additional Information
  uaeDrivingLicense: boolean
  relocationPossibility: boolean
  languages: Array<{
    language: string
    proficiency: string
  }>

  // Application Questions
  previouslyWorked: boolean
  workDetails: string
  relativesOrFriends: boolean
  relativeNames: string
  relationships: Array<{
    name: string
    relationship: string
    department: string
  }>

  // Experience Data
  experienceData: Array<{
    company: string
    position: string
    duration: string
    responsibilities: string
  }>
}

export const useJobApplication = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitApplication = async (
    jobId: string,
    formData: JobApplicationData,
    cvFile?: File | null,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true)
    setError(null)

    try {
      console.log("Submitting application for job:", jobId)
      console.log("Form data:", formData)
      console.log("CV file:", cvFile)

      // Create FormData for multipart upload
      const submitFormData = new FormData()

      // Add application data as JSON string
      submitFormData.append(
        "data",
        JSON.stringify({
          jobId,
          formData,
        }),
      )

      // Add CV file if provided
      if (cvFile) {
        submitFormData.append("cv", cvFile)
      }

      // Submit to our API route
      const response = await fetch("/api/odoo/apply", {
        method: "POST",
        body: submitFormData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.details || result.error || "Failed to submit application")
      }

      console.log("Application submitted successfully:", result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit application"
      console.error("Error submitting application:", err)
      setError(errorMessage)
      return { success: false, error: errorMessage }
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
