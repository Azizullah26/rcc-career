"use client"

import React from "react"
import { useRouter, useParams } from "next/navigation"
import { Menu, X, Plus, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group"
import Link from "next/link"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

// Countries list for nationality dropdown
const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
]

// Available languages
const availableLanguages = [
  "Arabic",
  "English",
  "French",
  "German",
  "Spanish",
  "Italian",
  "Portuguese",
  "Russian",
  "Chinese",
  "Japanese",
  "Korean",
  "Hindi",
  "Urdu",
  "Turkish",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
]

// Proficiency levels
const proficiencyLevels = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"]

const textRedAsterisk = "*"

export const JobApplication = (): JSX.Element => {
  const router = useRouter()
  const { jobId } = useParams<{ jobId: string }>()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)

  // Simple state management without form validation
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    nationality: "",
    gender: "",
    maritalStatus: "",
    totalExperience: "",
    currentLocation: "",
    expectedSalary: "",
    joiningPossibility: "",
    egyptDrivingLicense: "",
    languages: [{ id: 1, language: "arabic", proficiency: "native" }],
  })

  const navItems = [
    { name: "HOME", href: "https://elrace.com/" },
    { name: "PROJECTS", href: "https://elrace.com/projects" },
    { name: "CAREERS", href: "/" },
    { name: "CONTACT", href: "https://elrace.com/" },
  ]

  // Form fields data
  const formFields = [
    { id: "fullName", label: "Full Name", type: "text", required: true },
    { id: "email", label: "Email Address", type: "email", required: true },
    { id: "phone", label: "Phone Number", type: "tel", required: true },
    { id: "dob", label: "Date of Birth", type: "date", required: true },
    { id: "nationality", label: "Nationality", type: "text", required: true },
    { id: "gender", label: "Gender", type: "text", required: true },
    { id: "maritalStatus", label: "Marital Status", type: "text", required: true },
    { id: "totalExperience", label: "Total Experience", type: "number", required: true },
    { id: "currentLocation", label: "Current Location", type: "text", required: true },
    { id: "expectedSalary", label: "Expected Salary", type: "text", required: true },
    { id: "joiningPossibility", label: "Joining Possibility", type: "text", required: true },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ]
      if (allowedTypes.includes(file.type)) {
        setUploadedFile(file)
        console.log("File uploaded:", file.name)
      } else {
        alert("Please upload a PDF, DOC, DOCX, or text file.")
        event.target.value = ""
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLanguageChange = (id: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang)),
    }))
  }

  const addLanguage = () => {
    const newId = Math.max(...formData.languages.map((l) => l.id)) + 1
    setFormData((prev) => ({
      ...prev,
      languages: [...prev.languages, { id: newId, language: "", proficiency: "basic" }],
    }))
  }

  const removeLanguage = (id: number) => {
    if (formData.languages.length > 1) {
      setFormData((prev) => ({
        ...prev,
        languages: prev.languages.filter((lang) => lang.id !== id),
      }))
    }
  }

  const handleNext = () => {
    // Validate all required fields
    const requiredFields = {
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      dob: "Date of Birth",
      nationality: "Nationality",
      gender: "Gender",
      maritalStatus: "Marital Status",
      totalExperience: "Total Experience",
      currentLocation: "Current Location",
      expectedSalary: "Expected Salary",
      joiningPossibility: "Joining Possibility",
    }

    const missingFields: string[] = []
    for (const [key, label] of Object.entries(requiredFields)) {
      if (!formData[key as keyof typeof formData]) {
        missingFields.push(label)
      }
    }

    // Check if CV is uploaded
    if (!uploadedFile) {
      missingFields.push("CV/Resume")
    }

    // Check if all languages have both language and proficiency selected
    for (let i = 0; i < formData.languages.length; i++) {
      const lang = formData.languages[i]
      if (!lang.language || !lang.proficiency) {
        missingFields.push(`Language ${i + 1} (language and proficiency)`)
      }
    }

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields:\n\n• ${missingFields.join("\n• ")}`)
      return
    }

    if (isProcessing) {
      console.log("[v0] Already processing, ignoring click")
      return
    }

    setIsProcessing(true)
    console.log("[v0] Next button clicked, starting processing")

    if (uploadedFile) {
      console.log("[v0] CV file detected, converting to base64...")
      const reader = new FileReader()

      reader.onerror = (error) => {
        console.error("[v0] FileReader error:", error)
        setIsProcessing(false)
        alert("Error reading CV file. Please try again.")
      }

      reader.onloadend = () => {
        try {
          const base64String = reader.result as string
          localStorage.setItem("cvFile", base64String)
          localStorage.setItem("cvFileName", uploadedFile.name)
          localStorage.setItem("cvFileSize", uploadedFile.size.toString())
          localStorage.setItem("cvFileType", uploadedFile.type)
          console.log("[v0] CV file converted to base64 and stored in localStorage")

          // Store personal information
          localStorage.setItem("personalInfo", JSON.stringify(formData))
          console.log("[v0] Personal info stored, navigating to next page...")

          // Navigate to next page
          const nextUrl = `/extended-application-questions/${jobId}`
          console.log("[v0] Navigating to:", nextUrl)
          router.push(nextUrl)
        } catch (error) {
          console.error("[v0] Error in onloadend handler:", error)
          setIsProcessing(false)
          alert("Error processing CV file. Please try again.")
        }
      }

      reader.readAsDataURL(uploadedFile)
    } else {
      console.log("[v0] No CV file, proceeding without CV...")
      // No CV file, just store personal info and navigate
      localStorage.setItem("personalInfo", JSON.stringify(formData))
      console.log("[v0] Personal info stored, navigating to next page...")

      const nextUrl = `/extended-application-questions/${jobId}`
      console.log("[v0] Navigating to:", nextUrl)
      router.push(nextUrl)
    }
  }

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1280px] relative min-h-screen">
        <header className="fixed w-full h-[90px] md:h-[115px] top-0 left-0 bg-white/90 backdrop-blur-sm z-50">
          <div className="max-w-[1920px] mx-auto flex items-center justify-between px-4 md:px-[103px] xl:px-[200px] 2xl:px-[300px] h-full">
            <Link
              href="/"
              className="absolute left-[65px] xl:left-[200px] 2xl:left-[300px] top-[5px] md:top-[8px] flex items-center justify-center overflow-hidden -ml-[33px]"
            >
              <img
                className="w-[140px] h-[92px] object-contain md:w-[200px] md:h-[130px] scale-[1.6] brightness-[1.21] saturate-[0.8]"
                alt="EL RACE Logo"
                src="/images/design-mode/Logonew.gif"
              />
            </Link>
            <div className="hidden lg:flex items-center gap-[42px] mr-[180px] xl:mr-[280px] 2xl:mr-[380px] ml-auto">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="font-medium text-[#484848] text-[18.7px] xl:text-[16px] 2xl:text-[15px] hover:text-[#ce363a] hover:scale-[1.2] transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <button
              className="lg:hidden p-2 ml-auto"
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

          {isMobileMenuOpen && (
            <div className="lg:hidden fixed top-[90px] left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
              <nav className="max-w-[1280px] mx-auto flex flex-col p-4">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="py-3 px-2 font-medium text-[#484848] text-[16px] md:text-[18px] hover:text-[#ce363a] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </header>
        <main className="pt-[105px] md:pt-[140px] px-4 md:px-[85px] pb-10">
          {/* Page Title */}
          <Card className="w-full border-none shadow-none mb-4 md:mb-8">
            <CardContent className="p-0 text-center">
              <h1 className="font-sans font-bold text-[14px] md:text-[33.6px] text-[#151d61] tracking-normal leading-tight my-0 px-0 py-2.5">
                Job Application – Personal Information
              </h1>
              <p className="font-sans font-medium text-[10px] md:text-[24.6px] text-[#909090] underline mt-1">
                please enter your information
              </p>
            </CardContent>
          </Card>

          <Card className="w-full mb-6 md:mb-8">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-[#151d61] mb-4">Upload Your CV</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="cv-upload"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-[#151d61] rounded flex items-center justify-center">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-[#151d61] font-medium">Click to upload your CV</p>
                      <p className="text-sm text-gray-500">PDF, Word, or Text files (max 10MB)</p>
                    </div>
                  </label>
                </div>

                {uploadedFile && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                          <span className="text-green-600 text-sm">📄</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800">{uploadedFile.name}</p>
                          <p className="text-xs text-green-600">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button onClick={() => setUploadedFile(null)} className="text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Application Form */}
          <div className="space-y-2 md:space-y-4">
            <div className="flex flex-col w-full items-start gap-2 md:gap-[15px] relative">
              {formFields.map((field, index) => {
                if (field.id === "nationality") {
                  return (
                    <div
                      key={field.id}
                      className="flex flex-col items-center gap-1 md:gap-2 relative self-stretch w-full"
                    >
                      <Label className="self-stretch h-auto form-label-font text-black text-[12px] md:text-[16px] tracking-[0] leading-[normal]">
                        {index + 1}- {field.label}
                        {field.required && <span className="text-red-asterisk">{textRedAsterisk}</span>}
                      </Label>
                      <Select
                        value={formData.nationality}
                        onValueChange={(value) => handleInputChange("nationality", value)}
                      >
                        <SelectTrigger className="self-stretch w-full h-8 md:h-10 bg-white rounded-[47px] border border-solid border-black text-xs md:text-sm form-input-font">
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country} className="form-input-font">
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                } else if (field.id === "gender") {
                  return (
                    <div
                      key={field.id}
                      className="flex flex-col items-center gap-1 md:gap-2 relative self-stretch w-full"
                    >
                      <Label className="self-stretch h-auto form-label-font text-black text-[12px] md:text-[16px] tracking-[0] leading-[normal]">
                        {index + 1}- {field.label}
                        {field.required && <span className="text-red-asterisk">{textRedAsterisk}</span>}
                      </Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger className="self-stretch w-full h-8 md:h-10 bg-white rounded-[47px] border border-solid border-black text-xs md:text-sm form-input-font">
                          <SelectValue placeholder="Choose option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male" className="form-input-font">
                            Male
                          </SelectItem>
                          <SelectItem value="Female" className="form-input-font">
                            Female
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )
                } else if (field.id === "maritalStatus") {
                  return (
                    <div
                      key={field.id}
                      className="flex flex-col items-center gap-1 md:gap-2 relative self-stretch w-full"
                    >
                      <Label className="self-stretch h-auto form-label-font text-black text-[12px] md:text-[16px] tracking-[0] leading-[normal]">
                        {index + 1}- {field.label}
                        {field.required && <span className="text-red-asterisk">{textRedAsterisk}</span>}
                      </Label>
                      <Select
                        value={formData.maritalStatus}
                        onValueChange={(value) => handleInputChange("maritalStatus", value)}
                      >
                        <SelectTrigger className="self-stretch w-full h-8 md:h-10 bg-white rounded-[47px] border border-solid border-black text-xs md:text-sm form-input-font">
                          <SelectValue placeholder="Choose option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single" className="form-input-font">
                            Single
                          </SelectItem>
                          <SelectItem value="Married" className="form-input-font">
                            Married
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )
                } else if (field.id === "totalExperience") {
                  return (
                    <div
                      key={field.id}
                      className="flex flex-col items-center gap-1 md:gap-2 relative self-stretch w-full"
                    >
                      <Label className="self-stretch h-auto form-label-font text-black text-[12px] md:text-[16px] tracking-[0] leading-[normal]">
                        {index + 1}- {field.label}
                        {field.required && <span className="text-red-asterisk">{textRedAsterisk}</span>}
                      </Label>
                      <Input
                        type={field.type}
                        value={formData[field.id as keyof typeof formData]}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="self-stretch w-full h-8 md:h-10 bg-white rounded-[47px] border border-solid border-black text-xs md:text-sm form-input-font placeholder:text-gray-500"
                      />
                    </div>
                  )
                } else {
                  return (
                    <div
                      key={field.id}
                      className="flex flex-col items-center gap-1 md:gap-2 relative self-stretch w-full"
                    >
                      <Label className="self-stretch h-auto form-label-font text-black text-[12px] md:text-[16px] tracking-[0] leading-[normal]">
                        {index + 1}- {field.label}
                        {field.required && <span className="text-red-asterisk">{textRedAsterisk}</span>}
                      </Label>
                      <Input
                        type={field.type}
                        value={formData[field.id as keyof typeof formData]}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="self-stretch w-full h-8 md:h-10 bg-white rounded-[47px] border border-solid border-black text-xs md:text-sm form-input-font placeholder:text-gray-500"
                      />
                    </div>
                  )
                }
              })}

              <div className="flex flex-col w-full items-start gap-3 md:gap-[25px] relative">
                {/* UAE Driving license toggle */}
                <div className="flex flex-col items-start gap-1 md:gap-3 relative self-stretch w-full">
                  <Label className="flex-1 self-stretch form-label-font text-black text-[12px] md:text-[16px] tracking-[0] leading-[normal]">
                    12- UAE Driving License
                    <span className="text-red-asterisk">{textRedAsterisk}</span>
                  </Label>
                  <ToggleGroup
                    type="single"
                    value={formData.egyptDrivingLicense}
                    onValueChange={(value) => handleInputChange("egyptDrivingLicense", value)}
                    className="flex w-full max-w-[140px] md:max-w-[160px] h-[25px] md:h-[32px] items-center gap-2 md:gap-3 relative"
                  >
                    <ToggleGroupItem
                      value="yes"
                      className="flex-1 h-[25px] md:h-[32px] rounded-[20px] flex items-center justify-center bg-[#d9d9d9] form-input-font text-black text-[12px] md:text-[16px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white"
                    >
                      Yes
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="no"
                      className="flex-1 h-[25px] md:h-[32px] rounded-[20px] flex items-center justify-center bg-[#d9d9d9] form-input-font text-black text-[12px] md:text-[16px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white"
                    >
                      No
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Languages section */}
                <div className="flex flex-col items-start gap-1 md:gap-2 relative self-stretch w-full">
                  <Label className="self-stretch form-label-font text-black text-[12px] md:text-[16px] tracking-[0] leading-[normal]">
                    13- Languages
                    <span className="text-red-asterisk">{textRedAsterisk}</span>
                  </Label>

                  {/* Dynamic Languages */}
                  <div className="flex flex-col gap-3 w-full">
                    {formData.languages.map((lang, index) => (
                      <div
                        key={lang.id}
                        className="flex flex-col md:flex-row items-start gap-2 md:gap-3 p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex-1 min-w-0">
                          <Label className="form-label-font text-black text-[10px] md:text-[12px] tracking-[0] leading-[normal] mb-1 block">
                            Language {index + 1}
                          </Label>
                          <Select
                            value={lang.language}
                            onValueChange={(value) => handleLanguageChange(lang.id, "language", value)}
                          >
                            <SelectTrigger className="w-full h-8 md:h-9 bg-white rounded-[47px] border border-solid border-gray-300 text-xs form-input-font">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableLanguages.map((language) => (
                                <SelectItem
                                  key={language.toLowerCase()}
                                  value={language.toLowerCase()}
                                  className="form-input-font"
                                >
                                  {language}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex-1 min-w-0">
                          <Label className="form-label-font text-black text-[10px] md:text-[12px] tracking-[0] leading-[normal] mb-1 block">
                            Proficiency Level
                          </Label>
                          <Select
                            value={lang.proficiency}
                            onValueChange={(value) => handleLanguageChange(lang.id, "proficiency", value)}
                          >
                            <SelectTrigger className="w-full h-8 md:h-9 bg-white rounded-[47px] border border-solid border-gray-300 text-xs form-input-font">
                              <SelectValue placeholder="Select proficiency" />
                            </SelectTrigger>
                            <SelectContent>
                              {proficiencyLevels.map((level) => (
                                <SelectItem
                                  key={level.toLowerCase()}
                                  value={level.toLowerCase()}
                                  className="form-input-font"
                                >
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Remove Language Button */}
                        {formData.languages.length > 1 && (
                          <div className="flex flex-col justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeLanguage(lang.id)}
                              className="w-8 h-8 md:w-9 md:h-9 bg-red-100 hover:bg-red-200 rounded-full border border-red-300 flex items-center justify-center mt-4"
                            >
                              <span className="text-red-600 text-sm font-bold">×</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add More Languages Button */}
                    <div className="flex justify-center mt-1">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addLanguage}
                        className="flex items-center gap-2 h-8 md:h-9 px-3 md:px-4 bg-[#d9d9d9] hover:bg-[#c9c9c9] rounded-[47px] border border-solid border-black transition-colors"
                      >
                        <span className="form-input-font text-[#505050] text-[16px] md:text-[18px]">+</span>
                        <span className="form-input-font text-black text-[10px] md:text-[12px]">Add Language</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col gap-3 md:gap-[90px] my-6 md:flex-row justify-center items-center md:my-10 mx-80 py-0 px-20">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full md:w-[80px] h-[28px] md:h-[35px] bg-white rounded-[38px] [font-family:'Inter',Helvetica] font-medium text-[#151d61] text-[14px] md:text-[20px] border border-[#151d61] hover:bg-gray-50 transition-colors order-2 md:order-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={isProcessing}
                  className="w-full md:w-[80px] h-[28px] md:h-[35px] bg-[#151d61] rounded-[38px] [font-family:'Inter',Helvetica] font-medium text-white text-[14px] md:text-[20px] border-none hover:bg-[#1a2570] transition-colors order-1 md:order-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                      <span className="text-[10px] md:text-[14px]">Process</span>
                    </>
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
