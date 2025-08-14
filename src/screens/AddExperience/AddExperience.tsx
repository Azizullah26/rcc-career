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
import type { JSX } from "react/jsx-runtime"

export const AddExperience = (): JSX.Element => {
  const router = useRouter()
  const { jobId } = useParams<{ jobId: string }>()
  const { submitApplication, isSubmitting, submitError } = useJobApplication()

  // State for managing experience cards
  const [experienceCards, setExperienceCards] = useState([1, 2])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [experienceData, setExperienceData] = useState<Record<string, string>>({})
  const [currentlyWorkingStatus, setCurrentlyWorkingStatus] = useState<Record<number, boolean>>({})

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
    console.log("Currently Working Status:", currentlyWorkingStatus)
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
      currentlyWorkingStatus: currentlyWorkingStatus,
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
            {/* Logo and Back Button */}
            <div className="flex items-center">
              <img
                className="w-[100px] h-[45px] font-medium md:h-20 md:w-36 my-[22px] mx-24"
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
        <main className="pt-[60px] md:pt-[80px] px-4 md:px-[60px] pb-[30px] md:pb-[50px] ml-[10px]">
          {/* Back Button */}
          <div className="mb-6 py-5">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 md:gap-2 text-[#656565] hover:text-[#151d61] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="[font-family:'Tajawal',Helvetica] font-normal text-[14px] md:text-[18px]">Back</span>
            </button>
          </div>

          {/* Page Title */}
          <h1 className="text-center [font-family:'Inter',Helvetica] font-bold text-[#151d61] text-[9px] md:text-[16px] mb-[8px] md:mb-[30px] leading-tight">
            Please provide details about your latest work experience
          </h1>

          {/* Experience Cards Container */}
          <div className="flex flex-col w-full max-w-[1021px] mx-auto items-center gap-[12px] md:gap-[25px]">
            {/* Experience Cards */}
            {experienceCards.map((cardNumber) => (
              <div key={cardNumber} className="w-full">
                {/* Previous Experience Label for each card */}
                <div className="mb-2 md:mb-3">
                  <h3 className="text-left [font-family:'Inter',Helvetica] text-black text-[11px] md:text-[13px] leading-normal font-semibold font-sans italic">
                    Previous Experience
                  </h3>
                </div>

                <Card className="flex flex-col h-auto items-center gap-2.5 px-2 md:px-[25px] py-2 md:py-[15px] w-full bg-[#ffffff7a] rounded-[45px] border border-solid border-black shadow-sm">
                  <CardContent className="flex flex-col items-center justify-between w-full p-0 gap-3 md:gap-6">
                    {formFields.map((field, index) => (
                      <div key={`field${cardNumber}-${index}`} className="flex flex-col items-start w-full">
                        <label
                          className="mb-1 md:mb-2 [font-family:'Inter',Helvetica] font-semibold text-black text-[13px] md:text-[16px] tracking-[0] leading-[normal]"
                          dangerouslySetInnerHTML={{ __html: field.label }}
                        />
                        {field.id === "end-date" ? (
                          <Input
                            id={`${field.id}-${cardNumber}`}
                            type={field.type}
                            value={experienceData[`${field.id}-${cardNumber}`] || ""}
                            onChange={(e) => handleExperienceChange(`${field.id}-${cardNumber}`, e.target.value)}
                            disabled={currentlyWorkingStatus[cardNumber]}
                            className={`w-full h-[35px] md:h-[55px] bg-white rounded-[79px] border border-solid border-black px-4 md:px-6 text-xs md:text-sm ${
                              currentlyWorkingStatus[cardNumber] ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          />
                        ) : (
                          <Input
                            id={`${field.id}-${cardNumber}`}
                            type={field.type}
                            value={experienceData[`${field.id}-${cardNumber}`] || ""}
                            onChange={(e) => handleExperienceChange(`${field.id}-${cardNumber}`, e.target.value)}
                            className="w-full h-[35px] md:h-[55px] bg-white rounded-[79px] border border-solid border-black px-4 md:px-6 text-xs md:text-sm"
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
                        className="[font-family:'Inter',Helvetica] font-medium text-black text-[11px] md:text-[13px] cursor-pointer"
                      >
                        Are you currently working in this company/position?
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
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

            {/* Bottom Action Buttons */}
            <div className="flex flex-col w-full max-w-[244px] items-center gap-[12px] md:gap-[20px] mt-[20px] md:mt-[40px]">
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
                className="h-[30px] md:h-[40px] w-full rounded-[47px] border-[3px] border-solid border-[#151d61] text-[#151d61] hover:bg-[#151d61] hover:text-white transition-colors bg-transparent"
              >
                <span className="[font-family:'Inter',Helvetica] font-bold text-[12px] md:text-[16px] text-center">
                  {uploadedFile
                    ? `CV: ${uploadedFile.name.length > 15 ? uploadedFile.name.substring(0, 15) + "..." : uploadedFile.name}`
                    : "Upload Your CV"}
                </span>
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full max-w-[180px] h-[35px] md:h-[50px] bg-[#151d61] rounded-[16px] hover:bg-[#1a2470] transition-colors"
              >
                <span className="[font-family:'Tajawal',Helvetica] font-bold text-white text-[18px] md:text-[24px]">
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
