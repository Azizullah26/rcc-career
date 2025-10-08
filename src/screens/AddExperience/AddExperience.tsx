"use client"

import React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Menu, X, PlusIcon, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { useJobApplication } from "../../hooks/useJobApplication"
import Link from "next/link"
import type { JSX } from "react/jsx-runtime"

export const AddExperience = (): JSX.Element => {
  const router = useRouter()
  const { jobId } = useParams<{ jobId: string }>()
  const { submitApplication, isSubmitting, isScreening, error: submitError } = useJobApplication()

  const [experienceCards, setExperienceCards] = React.useState([1])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [experienceData, setExperienceData] = React.useState<Record<string, string>>({})
  const [currentlyWorkingStatus, setCurrentlyWorkingStatus] = React.useState<Record<number, boolean>>({})

  // Navigation menu items
  const navItems = [
    { name: "SEARCH CAREERS", href: "/search-careers" },
    { name: "CAREERS", href: "/" },
  ]

  // Form fields for each experience card
  const formFields = [
    { label: "Company Name<span class='text-red-500'>*</span>", id: "company-name", type: "text" },
    { label: "Job Title<span class='text-red-500'>*</span>", id: "job-title", type: "text" },
    { label: "Start Date<span class='text-red-500'>*</span>", id: "start-date", type: "date" },
    { label: "End Date<span class='text-red-500'>*</span>", id: "end-date", type: "date" },
  ]

  const addExperienceCard = () => {
    setExperienceCards([...experienceCards, experienceCards.length + 1])
  }

  const handleSubmit = async () => {
    if (!jobId) {
      alert("Job ID is missing")
      return
    }

    console.log("Starting application submission with screening...")

    // Get form data from localStorage (stored from previous steps)
    const personalInfo = JSON.parse(localStorage.getItem("personalInfo") || "{}")
    const extendedQuestions = JSON.parse(localStorage.getItem("extendedQuestions") || "{}")

    const cvFileName = localStorage.getItem("cvFileName")
    const cvFileSize = localStorage.getItem("cvFileSize")
    const cvFileType = localStorage.getItem("cvFileType")

    const uploadedFile = null
    if (cvFileName && cvFileSize && cvFileType) {
      // Create a placeholder file object for submission
      console.log("CV file info retrieved:", { cvFileName, cvFileSize, cvFileType })
    }

    // Combine all form data with additional fields for screening
    const combinedFormData = {
      // Personal Information
      fullName: personalInfo.fullName || "",
      email: personalInfo.email || "",
      phone: personalInfo.phone || "",
      dob: personalInfo.dob || "",
      nationality: personalInfo.nationality || "",
      gender: personalInfo.gender || "",
      maritalStatus: personalInfo.maritalStatus || "",

      // Experience
      totalExperience: personalInfo.totalExperience || "",
      uaeExperience: personalInfo.egyptExperience || "", // Note: mapping egyptExperience to uaeExperience
      currentLocation: personalInfo.currentLocation || "",
      expectedSalary: personalInfo.expectedSalary || "",
      joiningPossibility: personalInfo.joiningPossibility || "",

      // Additional Info
      uaeDrivingLicense: personalInfo.egyptDrivingLicense || "no", // Note: mapping egyptDrivingLicense to uaeDrivingLicense
      relocationPossibility: personalInfo.relocationPossibility || "no",
      languages: personalInfo.languages || [],

      // Application Questions
      previouslyWorked: extendedQuestions.previousWork || "no",
      workDetails: extendedQuestions.workDetails || "",
      relativesOrFriends: extendedQuestions.relativesOrFriends || "no",
      names: extendedQuestions.names || "",
      selectedRelationship: extendedQuestions.selectedRelationship || "",

      // Experience Data
      experienceData: experienceData,
      currentlyWorkingStatus: currentlyWorkingStatus,

      // Additional fields for screening
      education: personalInfo.education || extendedQuestions.education || "",
      certifications: extendedQuestions.certifications || personalInfo.certifications || "",
    }

    console.log("Combined Form Data:", combinedFormData)

    // Get job title from localStorage if available
    const jobTitle = localStorage.getItem("jobTitle") || "Construction Project Manager"
    const jobName = localStorage.getItem("jobName") || undefined

    const result = await submitApplication(jobId, combinedFormData, uploadedFile, jobTitle, jobName)

    if (result.success && result.screeningResult) {
      console.log("Application submitted successfully with screening results!")
      const jobReferenceNumber = localStorage.getItem("jobReferenceNumber") || ""

      // Clear stored data
      localStorage.removeItem("personalInfo")
      localStorage.removeItem("extendedQuestions")
      localStorage.removeItem("jobTitle")
      localStorage.removeItem("jobName")
      localStorage.removeItem("cvFileName")
      localStorage.removeItem("cvFileSize")
      localStorage.removeItem("cvFileType")
      localStorage.removeItem("jobReferenceNumber")

      const params = new URLSearchParams({
        result: encodeURIComponent(JSON.stringify(result.screeningResult)),
        referenceNumber: result.referenceNumber || "",
        jobReferenceNumber: jobReferenceNumber,
      })
      router.push(`/application-success?${params.toString()}`)
    } else {
      // Error occurred
      console.error("Application submission failed:", result.error)
      alert(result.error || "An error occurred while submitting your application. Please try again.")
    }
  }

  const handleExperienceChange = (field: string, value: string) => {
    setExperienceData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCurrentlyWorkingChange = (cardNumber: number, isWorking: boolean) => {
    setCurrentlyWorkingStatus((prev) => ({ ...prev, [cardNumber]: isWorking }))

    // If currently working is checked, clear the end date for this card
    if (isWorking) {
      setExperienceData((prev) => ({ ...prev, [`end-date-${cardNumber}`]: "" }))
    }
  }

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1280px] relative min-h-screen">
        {/* Header/Navigation */}
        <header className="fixed w-full h-[70px] md:h-[91px] top-0 left-0 bg-[#ebebeb] z-50">
          <div className="flex items-center justify-between px-4 md:px-[68px] h-full">
            {/* Logo */}
            <div className="flex items-center">
              <img
                className="w-[140px] h-[75px] my-0 mx-20 md:w-[200px] md:h-[105px]"
                alt="EL RACE Logo"
                src="/images/design-mode/Logonew.gif"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between gap-10">
              <nav className="flex items-center gap-[34px]">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[18.7px] tracking-[0] leading-normal whitespace-nowrap text-[#656565] hover:text-[#151d61] transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 z-50 relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#151d61]" />
              ) : (
                <Menu className="w-6 h-6 text-[#151d61]" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed top-[70px] md:top-[91px] left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
              <nav className="flex flex-col p-4">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="py-3 px-2 [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[16px] md:text-[18px] transition-colors hover:text-[#151d61]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="pt-[90px] md:pt-[120px] px-4 md:px-[85px] pb-10">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 md:gap-2 text-[#656565] hover:text-[#151d61] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="[font-family:'Tajawal',Helvetica] font-normal text-[14px] md:text-[18px]">Back</span>
            </button>
          </div>

          {/* Page Title */}
          <Card className="w-full border-none shadow-none mb-4 md:mb-8">
            <CardContent className="p-0 text-center">
              <h1 className="font-sans font-bold text-[14px] md:text-[33.6px] text-[#151d61] tracking-normal leading-tight my-0 px-0 py-2.5">
                Add Your Experience
              </h1>
              <p className="font-sans font-medium text-[10px] md:text-[24.6px] text-[#909090] underline mt-1">
                Tell us about your work experience
              </p>
            </CardContent>
          </Card>

          {/* Experience Section */}
          <div className="space-y-6">
            {experienceCards.map((cardNumber) => (
              <Card key={cardNumber} className="w-full">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm md:text-lg font-semibold text-[#151d61]">
                      Previous Experience {cardNumber}
                    </h3>
                    {experienceCards.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setExperienceCards(experienceCards.filter((card) => card !== cardNumber))}
                        className="text-red-500 border-red-300 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {formFields.map((field, index) => (
                      <div key={`field${cardNumber}-${index}`} className="flex flex-col items-start w-full">
                        <label
                          className="mb-1 md:mb-2 [font-family:'Inter',Helvetica] font-semibold text-black text-[11px] md:text-[14px] tracking-[0] leading-[normal]"
                          dangerouslySetInnerHTML={{ __html: field.label }}
                        />
                        {field.id === "end-date" ? (
                          <Input
                            id={`${field.id}-${cardNumber}`}
                            type={field.type}
                            value={experienceData[`${field.id}-${cardNumber}`] || ""}
                            onChange={(e) => handleExperienceChange(`${field.id}-${cardNumber}`, e.target.value)}
                            disabled={currentlyWorkingStatus[cardNumber]}
                            className={`w-full h-[30px] md:h-[45px] bg-white rounded-[79px] border border-solid border-black px-4 md:px-6 text-xs md:text-sm ${
                              currentlyWorkingStatus[cardNumber] ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          />
                        ) : (
                          <Input
                            id={`${field.id}-${cardNumber}`}
                            type={field.type}
                            value={experienceData[`${field.id}-${cardNumber}`] || ""}
                            onChange={(e) => handleExperienceChange(`${field.id}-${cardNumber}`, e.target.value)}
                            className="w-full h-[30px] md:h-[45px] bg-white rounded-[79px] border border-solid border-black px-4 md:px-6 text-xs md:text-sm"
                          />
                        )}
                      </div>
                    ))}

                    {/* Currently Working Checkbox for each card */}
                    <div className="flex items-center gap-3 w-full mt-2">
                      <input
                        type="checkbox"
                        id={`currently-working-${cardNumber}`}
                        checked={currentlyWorkingStatus[cardNumber] || false}
                        onChange={(e) => handleCurrentlyWorkingChange(cardNumber, e.target.checked)}
                        className="w-4 h-4 text-[#151d61] bg-white border-2 border-black rounded focus:ring-[#151d61] focus:ring-2"
                      />
                      <label
                        htmlFor={`currently-working-${cardNumber}`}
                        className="[font-family:'Inter',Helvetica] font-medium text-black text-[10px] md:text-[12px] cursor-pointer"
                      >
                        Are you currently working in this company/position?
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add More Button */}
            <Button
              onClick={addExperienceCard}
              variant="outline"
              className="flex flex-col w-[50px] md:w-[70px] items-center p-0 border-none bg-transparent hover:bg-transparent"
            >
              <div className="w-[35px] md:w-[50px] h-[35px] md:h-[50px] bg-white rounded-full border border-solid border-black flex items-center justify-center hover:bg-gray-50 transition-colors">
                <PlusIcon className="text-[#151d61] w-[20px] md:w-[30px] h-[20px] md:h-[30px]" />
              </div>
            </Button>

            {submitError && <div className="text-red-600 text-sm mt-2 text-center">{submitError}</div>}
          </div>

          {/* Error Display */}
          {submitError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          {/* Screening Status */}
          {isScreening && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-blue-600 text-sm font-medium">
                  🔍 Screening your application against job requirements...
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-3 md:gap-[90px] my-6 md:flex-row justify-center items-center md:my-10 mx-80 py-0 px-20">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              disabled={isSubmitting}
              className="w-full md:w-[80px] h-[28px] md:h-[35px] bg-[#d9d9d9] rounded-[38px] [font-family:'Inter',Helvetica] font-medium text-black text-[14px] md:text-[20px] border-none hover:bg-gray-300 transition-colors order-2 md:order-1"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isScreening}
              className="w-full md:w-[80px] h-[28px] md:h-[35px] bg-[#151d61] rounded-[38px] [font-family:'Inter',Helvetica] font-medium text-white text-[14px] md:text-[20px] border-none hover:bg-[#1a2570] transition-colors order-1 md:order-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting || isScreening ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#151d61] text-white py-8 px-4 md:px-[68px]">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="col-span-1 md:col-span-2">
                <img
                  className="w-[140px] h-[65px] md:w-[200px] md:h-[90px] mb-4 object-contain"
                  alt="EL RACE Logo"
                  src="/images/design-mode/Logonew.gif"
                />
                <p className="text-sm text-gray-300 leading-relaxed">
                  Leading construction and contracting company in the UAE, delivering excellence in every project.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/search-careers" className="text-gray-300 hover:text-white transition-colors">
                      Search Jobs
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://ae.indeed.com/cmp/Elrace-Constructions-and-General-Contracting-Co.-LLC/jobs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Indeed Jobs
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>EL RACE UAE</p>
                  <p>600500722</p>
                  <p>Email: info@elrace.com</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-600 mt-8 pt-8 text-center">
              <p className="text-sm text-gray-300">© 2024 EL RACE Construction. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
