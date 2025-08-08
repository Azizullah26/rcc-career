"use client"

import React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Menu, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group"
import Link from "next/link"

export const JobApplication = (): JSX.Element => {
  const router = useRouter()
  const { jobId } = useParams<{ jobId: string }>()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

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
    egyptExperience: "",
    currentLocation: "",
    expectedSalary: "",
    joiningPossibility: "",
    egyptDrivingLicense: "yes",
    relocationPossibility: "yes",
    languages: [
      { id: 1, language: "arabic", proficiency: "native" },
      { id: 2, language: "english", proficiency: "fluent" }
    ],
  })

  // Available languages
  const availableLanguages = [
    "Arabic", "English", "French", "German", "Spanish", "Italian", 
    "Portuguese", "Russian", "Chinese", "Japanese", "Korean", "Hindi", 
    "Urdu", "Turkish", "Dutch", "Swedish", "Norwegian", "Danish"
  ]

  // Proficiency levels
  const proficiencyLevels = [
    "Native", "Fluent", "Advanced", "Intermediate", "Basic"
  ]

  // Navigation menu items
  const navItems = [
    { name: "HOME", href: "/" },
    { name: "PROJECTS", href: "#" },
    { name: "BLOGS", href: "#" },
    { name: "CONTACTS", href: "#" },
    { name: "SEARCH CAREERS", href: "/search-careers" },
    { name: "CAREERS", href: "/" },
  ]

  // Form fields data
  const formFields = [
    { id: "fullName", label: "Full Name*", type: "text" },
    { id: "email", label: "Email Address*", type: "email" },
    { id: "phone", label: "Phone Number*", type: "tel" },
    { id: "dob", label: "Date of Birth*", type: "date" },
    { id: "nationality", label: "Nationality*", type: "text" },
    { id: "gender", label: "Gender*", type: "text" },
    { id: "maritalStatus", label: "Marital Status*", type: "text" },
    { id: "totalExperience", label: "Total Experience*", type: "text" },
    { id: "egyptExperience", label: "UAE Experience*", type: "text" },
    { id: "currentLocation", label: "Current Location*", type: "text" },
    { id: "expectedSalary", label: "Expected Salary*", type: "text" },
    { id: "joiningPossibility", label: "Joining Possibility*", type: "text" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLanguageChange = (id: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      ),
    }))
  }

  const addLanguage = () => {
    const newId = Math.max(...formData.languages.map(l => l.id)) + 1
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

  const onSubmit = () => {
    // Store personal information in localStorage for later use
    localStorage.setItem('personalInfo', JSON.stringify(formData))
    console.log("Form submitted:", formData)
    // Navigate directly to extended application questions page
    router.push(`/extended-application-questions/${jobId}`)
  }

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1280px] relative min-h-screen">
        {/* Header/Navigation */}
        <header className="fixed w-full h-[70px] md:h-[91px] top-0 left-0 bg-[#ebebeb] z-50">
          <div className="flex items-center justify-between px-4 md:px-[68px] h-full">
            {/* Logo */}
            <div className="flex items-center">
              <img className="w-[100px] h-[45px] md:h-24 md:w-40" alt="EL RACE Logo" src="https://elrace.com/RCC4/Requirements/IMG/Logo2025new.gif" />
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

              <div className="flex items-center gap-[29px] ml-[60px]">
                <Button
                  variant="outline"
                  className="flex items-center gap-[5px] h-[39px] w-[104px] rounded-[9px] border border-solid border-[#151d61] bg-transparent hover:bg-[#151d61] hover:text-white transition-colors"
                >
                  <img className="w-[23px] h-[23px]" alt="Log in" src="/log-in.svg" />
                  <span className="[font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[#151d61] text-[19.7px]">
                    Sign in
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-[5px] h-[39px] w-[104px] rounded-[9px] border border-solid border-[#ce363a] bg-transparent hover:bg-[#ce363a] hover:text-white transition-colors"
                >
                  <img className="w-[21.69px] h-[21.69px]" alt="Language" src="/language.svg" />
                  <span className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#ce363a] text-[18.7px] text-left tracking-[0] leading-normal whitespace-nowrap [direction:rtl]">
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
                    <img className="w-[20px] h-[20px]" alt="Log in" src="/log-in.svg" />
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
        <main className="pt-[20px] md:pt-[30px] px-4 md:px-[85px] pb-10">
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
                Job Application – Personal Information
              </h1>
              <p className="font-sans font-medium text-[10px] md:text-[24.6px] text-[#909090] underline mt-1">
                please enter your information
              </p>
            </CardContent>
          </Card>

          {/* Application Form */}
          <div className="space-y-3 md:space-y-6">
            <div className="flex flex-col w-full items-start gap-3 md:gap-[23px] relative">
              {formFields.map((field) => (
                <div key={field.id} className="flex flex-col items-center gap-1 md:gap-3 relative self-stretch w-full">
                  <Label className="self-stretch h-auto [font-family:'Inter',Helvetica] font-semibold text-black text-[16px] md:text-[21.6px] tracking-[0] leading-[normal]">
                    {field.label}
                  </Label>
                  <Input
                    type={field.type}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="self-stretch w-full h-10 md:h-14 bg-[#d9d9d9] rounded-[47px] border border-solid border-black text-sm md:text-base"
                  />
                </div>
              ))}

              <div className="flex flex-col w-full items-start gap-4 md:gap-[39px] relative">
                {/* UAE Driving license toggle */}
                <div className="flex flex-col items-start gap-2 md:gap-6 relative self-stretch w-full">
                  <Label className="flex-1 self-stretch [font-family:'Inter',Helvetica] font-semibold text-black text-[16px] md:text-[21.6px] tracking-[0] leading-[normal]">
                    UAE Driving License*
                  </Label>
                  <ToggleGroup
                    type="single"
                    value={formData.egyptDrivingLicense}
                    onValueChange={(value) => handleInputChange("egyptDrivingLicense", value)}
                    className="flex w-full max-w-[240px] md:max-w-[274px] h-[40px] md:h-[55px] items-center gap-3 md:gap-5 relative"
                  >
                    <ToggleGroupItem
                      value="yes"
                      className="flex-1 h-[40px] md:h-[55px] rounded-[35.66px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[18px] md:text-[29.6px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white"
                    >
                      Yes
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="no"
                      className="flex-1 h-[40px] md:h-[55px] rounded-[35.68px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[18px] md:text-[29.6px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white"
                    >
                      No
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Relocation Possibility toggle */}
                <div className="flex flex-col items-start gap-2 md:gap-6 relative self-stretch w-full">
                  <Label className="flex-1 self-stretch [font-family:'Inter',Helvetica] font-semibold text-black text-[16px] md:text-[21.6px] tracking-[0] leading-[normal]">
                    Relocation Possibility*
                  </Label>
                  <ToggleGroup
                    type="single"
                    value={formData.relocationPossibility}
                    onValueChange={(value) => handleInputChange("relocationPossibility", value)}
                    className="flex w-full max-w-[240px] md:max-w-[274px] h-[40px] md:h-[55px] items-center gap-3 md:gap-5 relative"
                  >
                    <ToggleGroupItem
                      value="yes"
                      className="flex-1 h-[40px] md:h-[55px] rounded-[35.66px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[18px] md:text-[29.6px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white"
                    >
                      Yes
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="no"
                      className="flex-1 h-[40px] md:h-[55px] rounded-[35.68px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[18px] md:text-[29.6px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white"
                    >
                      No
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Languages section */}
                <div className="flex flex-col items-start gap-2 md:gap-3.5 relative self-stretch w-full">
                  <Label className="self-stretch [font-family:'Inter',Helvetica] font-semibold text-black text-[16px] md:text-[21.6px] tracking-[0] leading-[normal]">
                    Languages*
                  </Label>
                  
                  {/* Dynamic Languages */}
                  <div className="flex flex-col gap-4 w-full">
                    {formData.languages.map((lang, index) => (
                      <div key={lang.id} className="flex flex-col md:flex-row items-start gap-3 md:gap-4 p-4 bg-gray-50 rounded-lg border">
                        <div className="flex-1 min-w-0">
                          <Label className="[font-family:'Inter',Helvetica] font-normal text-black text-[12px] md:text-[14px] tracking-[0] leading-[normal] mb-1 block">
                            Language {index + 1}
                          </Label>
                          <Select
                            value={lang.language}
                            onValueChange={(value) => handleLanguageChange(lang.id, "language", value)}
                          >
                            <SelectTrigger className="w-full h-10 md:h-12 bg-white rounded-[47px] border border-solid border-gray-300 text-sm">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableLanguages.map((language) => (
                                <SelectItem key={language.toLowerCase()} value={language.toLowerCase()}>
                                  {language}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex-1 min-w-0">
                          <Label className="[font-family:'Inter',Helvetica] font-normal text-black text-[12px] md:text-[14px] tracking-[0] leading-[normal] mb-1 block">
                            Proficiency Level
                          </Label>
                          <Select
                            value={lang.proficiency}
                            onValueChange={(value) => handleLanguageChange(lang.id, "proficiency", value)}
                          >
                            <SelectTrigger className="w-full h-10 md:h-12 bg-white rounded-[47px] border border-solid border-gray-300 text-sm">
                              <SelectValue placeholder="Select proficiency" />
                            </SelectTrigger>
                            <SelectContent>
                              {proficiencyLevels.map((level) => (
                                <SelectItem key={level.toLowerCase()} value={level.toLowerCase()}>
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
                              className="w-10 h-10 md:w-12 md:h-12 bg-red-100 hover:bg-red-200 rounded-full border border-red-300 flex items-center justify-center mt-5"
                            >
                              <span className="text-red-600 text-lg font-bold">×</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add More Languages Button */}
                    <div className="flex justify-center mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addLanguage}
                        className="flex items-center gap-2 h-10 md:h-12 px-4 md:px-6 bg-[#d9d9d9] hover:bg-[#c9c9c9] rounded-[47px] border border-solid border-black transition-colors"
                      >
                        <span className="[font-family:'Inter',Helvetica] font-light text-[#505050] text-[20px] md:text-[24px]">+</span>
                        <span className="[font-family:'Inter',Helvetica] font-normal text-black text-[12px] md:text-[14px]">
                          Add Language
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-[90px] my-6 md:my-10">
              <Button
                type="button"
                onClick={() => router.back()}
                variant="outline"
                className="w-full md:w-[138px] h-[45px] md:h-[60px] rounded-[38px] text-black text-[20px] md:text-[32px] font-medium bg-[#d9d9d9] hover:bg-gray-300 transition-colors order-2 md:order-1"
              >
                Cancel
              </Button>

              <Button
                onClick={onSubmit}
                variant="outline"
                className="w-full md:w-[138px] h-[45px] md:h-[60px] rounded-[38px] text-white text-[20px] md:text-[32px] font-medium bg-[#151d61] hover:bg-[#1a2470] transition-colors border-[#151d61] order-1 md:order-2"
              >
                Next
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
