"use client"

import { LogInIcon, ArrowLeft, PlusIcon, Menu, X } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { useJobApplication } from "../../hooks/useJobApplication"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

export const AddExperience = (): JSX.Element => {
  const router = useRouter()
  const { jobId } = useParams<{ jobId: string }>()
  const { submitApplication, isSubmitting, submitError } = useJobApplication()

  // State for managing experience cards
  const [experienceCards, setExperienceCards] = useState([1, 2])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [experienceData, setExperienceData] = useState<Record<string, string>>({})

  // Navigation menu items
  const navItems = [
    { name: "HOME", href: "/" },
    { name: "PROJECTS", href: "#" },
    { name: "BLOGS", href: "#" },
    { name: "CONTACTS", href: "#" },
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (allowedTypes.includes(file.type)) {
        setUploadedFile(file)
        console.log("File uploaded:", file.name)
      } else {
        alert("Please upload a PDF, DOC, or DOCX file.")
        event.target.value = ""
      }
    }
  }

  const triggerFileUpload = () => {
    const fileInput = document.getElementById("cv-upload") as HTMLInputElement
    fileInput?.click()
  }

  const handleSubmit = async () => {
    if (!jobId) {
      alert("Job ID is missing")
      return
    }

    console.log("Starting application submission...")

    // Get form data from localStorage (stored from previous steps)
    const personalInfo = JSON.parse(localStorage.getItem("personalInfo") || "{}")
    const extendedQuestions = JSON.parse(localStorage.getItem("extendedQuestions") || "{}")

    console.log("Personal Info:", personalInfo)
    console.log("Extended Questions:", extendedQuestions)
    console.log("Experience Data:", experienceData)
    console.log("Uploaded File:", uploadedFile)

    // Combine all form data
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
    }

    console.log("Combined Form Data:", combinedFormData)

    const result = await submitApplication(jobId, combinedFormData, uploadedFile)

    if (result.success) {
      console.log("Application submitted successfully!")
      // Clear stored data
      localStorage.removeItem("personalInfo")
      localStorage.removeItem("extendedQuestions")
      router.push("/application-success")
    } else {
      console.error("Application submission failed:", result.error)
      alert(`Application submission failed: ${result.error}`)
    }
  }

  const handleExperienceChange = (field: string, value: string) => {
    setExperienceData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1280px] relative min-h-screen">
        {/* Header/Navigation */}
        <header className="fixed w-full h-[70px] md:h-[91px] top-0 left-0 bg-[#ebebeb] z-50">
          <div className="flex items-center justify-between px-4 md:px-[68px] h-full">
            {/* Logo and Back Button */}
            <div className="flex items-center">
              <img
                className="w-[100px] h-[45px] md:w-[150px] md:h-[68px]"
                alt="EL RACE Logo"
                src="https://elrace.com/RCC4/Requirements/IMG/Logo2025new.gif"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between">
              <ul className="flex items-center gap-[34px] mr-[29px]">
                {navItems.map((item, index) => (
                  <li key={index} className="inline-flex items-center justify-center">
                    <Link
                      href={item.href}
                      className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[18.7px] whitespace-nowrap hover:text-[#151d61] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-[29px] ml-[60px]">
                <Button
                  variant="outline"
                  className="h-[39px] w-[104px] rounded-[9px] border-[#151d61] text-[#151d61] hover:bg-[#151d61] hover:text-white transition-colors bg-transparent"
                >
                  <LogInIcon className="w-[23px] h-[23px] mr-[5px]" />
                  <span className="[font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[19.7px]">
                    Sign in
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="h-[39px] w-[104px] rounded-[9px] border-[#ce363a] text-[#ce363a] hover:bg-[#ce363a] hover:text-white transition-colors bg-transparent"
                >
                  <img className="w-[21.69px] h-[21.69px] mr-[5px]" alt="Language" src="/language.svg" />
                  <span className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[18.7px] text-left whitespace-nowrap [direction:rtl]">
                    العربيــة
                  </span>
                </Button>
              </div>
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
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-[45px] rounded-[9px] border border-solid border-[#151d61] bg-transparent hover:bg-[#151d61] hover:text-white transition-colors"
                  >
                    <LogInIcon className="w-[20px] h-[20px]" />
                    <span className="[font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[#151d61] text-[16px]">
                      Sign in
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-[45px] rounded-[9px] border border-solid border-[#ce363a] bg-transparent hover:bg-[#ce363a] hover:text-white transition-colors"
                  >
                    <img className="w-[18px] h-[18px]" alt="Language" src="/language.svg" />
                    <span className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#ce363a] text-[16px] [direction:rtl]">
                      العربيــة
                    </span>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="pt-[90px] md:pt-[120px] px-4 md:px-[123px] pb-[60px] md:pb-[100px] ml-[10px]">
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
          <h1 className="text-center [font-family:'Inter',Helvetica] font-bold text-[#151d61] text-[12px] md:text-[24.6px] mb-[15px] md:mb-[60px] leading-tight">
            Please provide details about your latest work experience
          </h1>

          {/* Experience Cards Container */}
          <div className="flex flex-col w-full max-w-[1021px] mx-auto items-center gap-[15px] md:gap-[30px]">
            {/* Experience Cards */}
            {experienceCards.map((cardNumber) => (
              <div key={cardNumber} className="w-full">
                {/* Previous Experience Label for each card */}
                <div className="mb-2 md:mb-3">
                  <h3 className="text-left [font-family:'Inter',Helvetica] font-medium text-black text-[14px] md:text-[18px] leading-normal">
                    Previous Experience
                  </h3>
                </div>

                <Card className="flex flex-col h-auto items-center gap-2.5 px-4 md:px-[46px] py-4 md:py-[31px] w-full bg-[#ffffff7a] rounded-[45px] border border-solid border-black shadow-sm">
                  <CardContent className="flex flex-col items-center justify-between w-full p-0 gap-3 md:gap-6">
                    {formFields.map((field, index) => (
                      <div key={`field${cardNumber}-${index}`} className="flex flex-col items-start w-full">
                        <label
                          className="mb-1 md:mb-2 [font-family:'Inter',Helvetica] font-semibold text-black text-[16px] md:text-[22.4px] tracking-[0] leading-[normal]"
                          dangerouslySetInnerHTML={{ __html: field.label }}
                        />
                        <Input
                          id={`${field.id}-${cardNumber}`}
                          type={field.type}
                          value={experienceData[`${field.id}-${cardNumber}`] || ""}
                          onChange={(e) => handleExperienceChange(`${field.id}-${cardNumber}`, e.target.value)}
                          className="w-full h-[50px] md:h-[78px] bg-white rounded-[79px] border border-solid border-black px-4 md:px-6 text-sm md:text-lg"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ))}

            {/* Add More Button */}
            <Button
              onClick={addExperienceCard}
              variant="outline"
              className="flex flex-col w-[70px] md:w-[108px] items-center p-0 border-none bg-transparent hover:bg-transparent"
            >
              <div className="w-[50px] md:w-[72px] h-[50px] md:h-[72px] bg-white rounded-full border border-solid border-black flex items-center justify-center hover:bg-gray-50 transition-colors">
                <PlusIcon className="text-[#151d61] w-[28px] md:w-[44px] h-[28px] md:h-[44px]" />
              </div>
            </Button>

            {/* Bottom Action Buttons */}
            <div className="flex flex-col w-full max-w-[244px] items-center gap-[15px] md:gap-[27px] mt-[30px] md:mt-[60px]">
              {/* Hidden file input */}
              <input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />

              <Button
                onClick={triggerFileUpload}
                variant="outline"
                className="h-[45px] md:h-[54px] w-full rounded-[47px] border-[3px] border-solid border-[#151d61] text-[#151d61] hover:bg-[#151d61] hover:text-white transition-colors bg-transparent"
              >
                <span className="[font-family:'Inter',Helvetica] font-bold text-[16px] md:text-[23.7px] text-center">
                  {uploadedFile
                    ? `CV: ${uploadedFile.name.length > 15 ? uploadedFile.name.substring(0, 15) + "..." : uploadedFile.name}`
                    : "Upload Your CV"}
                </span>
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full max-w-[207px] h-[50px] md:h-[67px] bg-[#151d61] rounded-[16px] hover:bg-[#1a2470] transition-colors"
              >
                <span className="[font-family:'Tajawal',Helvetica] font-bold text-white text-[24px] md:text-[36.6px]">
                  {isSubmitting ? "Submitting..." : "Apply"}
                </span>
              </Button>

              {submitError && <div className="text-red-600 text-sm mt-2 text-center">{submitError}</div>}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
