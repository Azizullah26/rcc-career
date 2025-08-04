"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Menu, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Form, FormControl, FormField, FormItem } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group"
import Link from "next/link"

// Define the form schema
const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  dob: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  gender: z.string().min(1, "Gender is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  totalExperience: z.string().min(1, "Total experience is required"),
  egyptExperience: z.string().min(1, "Egypt experience is required"),
  currentLocation: z.string().min(1, "Current location is required"),
  expectedSalary: z.string().min(1, "Expected salary is required"),
  joiningPossibility: z.string().min(1, "Joining possibility is required"),
  egyptDrivingLicense: z.string().default("yes"),
  relocationPossibility: z.string().default("yes"),
  firstLanguage: z.string().default("arabic"),
  secondLanguage: z.string().default("english"),
})

type FormData = z.infer<typeof formSchema>

export const JobApplication = (): JSX.Element => {
  const router = useRouter()
  const { jobId } = useParams<{ jobId: string }>()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Navigation menu items
  const navItems = [
    { name: "HOME", href: "/" },
    { name: "PROJECTS", href: "#" },
    { name: "BLOGS", href: "#" },
    { name: "CONTACTS", href: "#" },
    { name: "SEARCH CAREERS", href: "/search-careers" },
    { name: "CAREERS", href: "/" },
  ]

  // Initialize the form with react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      firstLanguage: "arabic",
      secondLanguage: "english",
    },
  })

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

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data)
    // Navigate to application questions page
    router.push(`/application-questions/${jobId}`)
  }

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1280px] relative min-h-screen">
        {/* Header/Navigation */}
        <header className="absolute w-full h-[91px] top-0 left-0 bg-[#ebebeb]">
          <div className="flex items-center justify-between px-4 md:px-[68px] h-full">
            {/* Logo */}
            <div className="flex items-center">
              <img className="w-[120px] h-[54px] md:w-[150px] md:h-[68px]" alt="EL RACE Logo" src="/pre-comp-2-1.svg" />
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
            <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#151d61]" />
              ) : (
                <Menu className="w-6 h-6 text-[#151d61]" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-[91px] left-0 right-0 bg-white border-t border-gray-200 z-50">
              <nav className="flex flex-col p-4">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="py-3 px-2 [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[18px] transition-colors hover:text-[#151d61]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-[39px] rounded-[9px] border border-solid border-[#151d61] bg-transparent hover:bg-[#151d61] hover:text-white transition-colors"
                  >
                    <img className="w-[20px] h-[20px]" alt="Log in" src="/log-in.svg" />
                    <span className="[font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[#151d61] text-[16px]">
                      Sign in
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-[39px] rounded-[9px] border border-solid border-[#ce363a] bg-transparent hover:bg-[#ce363a] hover:text-white transition-colors"
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
        <main className="pt-[120px] px-4 md:px-[85px] pb-10">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 md:gap-2 text-[#656565] hover:text-[#151d61] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="[font-family:'Tajawal',Helvetica] font-normal text-[16px] md:text-[18px]">Back</span>
            </button>
          </div>

          {/* Page Title */}
          <Card className="w-full border-none shadow-none mb-6 md:mb-8">
            <CardContent className="p-0 text-center">
              <h1 className="font-sans font-bold text-[24px] md:text-[33.6px] text-[#151d61] tracking-normal">
                Job Application – Personal Information
              </h1>
              <p className="font-sans font-medium text-[18px] md:text-[24.6px] text-[#909090] underline mt-1">
                please enter your information
              </p>
            </CardContent>
          </Card>

          {/* Application Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
              <div className="flex flex-col w-full items-start gap-4 md:gap-[23px] relative">
                {formFields.map((field) => (
                  <FormField
                    key={field.id}
                    name={field.id as keyof FormData}
                    render={({ field: formField }) => (
                      <FormItem className="flex flex-col items-center gap-2 md:gap-3 relative self-stretch w-full">
                        <Label className="self-stretch h-auto [font-family:'Inter',Helvetica] font-semibold text-black text-[18px] md:text-[21.6px] tracking-[0] leading-[normal]">
                          {field.label}
                        </Label>
                        <FormControl>
                          <Input
                            {...formField}
                            type={field.type}
                            className="self-stretch w-full h-12 md:h-14 bg-[#d9d9d9] rounded-[47px] border border-solid border-black"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}

                <div className="flex flex-col w-full items-start gap-6 md:gap-[39px] relative">
                  {/* UAE Driving license toggle */}
                  <FormField
                    name="egyptDrivingLicense"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start gap-4 md:gap-6 relative self-stretch w-full">
                        <Label className="flex-1 self-stretch [font-family:'Inter',Helvetica] font-semibold text-black text-[18px] md:text-[21.6px] tracking-[0] leading-[normal]">
                          UAE Driving License*
                        </Label>
                        <FormControl>
                          <ToggleGroup
                            type="single"
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex w-full max-w-[274px] h-[50px] md:h-[55px] items-center gap-4 md:gap-5 relative"
                          >
                            <ToggleGroupItem
                              value="yes"
                              className="flex-1 h-[50px] md:h-[55px] rounded-[35.66px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[24px] md:text-[29.6px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white"
                            >
                              Yes
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value="no"
                              className="flex-1 h-[50px] md:h-[55px] rounded-[35.68px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[24px] md:text-[29.6px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white"
                            >
                              No
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Relocation Possibility toggle */}
                  <FormField
                    name="relocationPossibility"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start gap-4 md:gap-6 relative self-stretch w-full">
                        <Label className="flex-1 self-stretch [font-family:'Inter',Helvetica] font-semibold text-black text-[18px] md:text-[21.6px] tracking-[0] leading-[normal]">
                          Relocation Possibility*
                        </Label>
                        <FormControl>
                          <ToggleGroup
                            type="single"
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex w-full max-w-[274px] h-[50px] md:h-[55px] items-center gap-4 md:gap-5 relative"
                          >
                            <ToggleGroupItem
                              value="yes"
                              className="flex-1 h-[50px] md:h-[55px] rounded-[35.66px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[24px] md:text-[29.6px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white"
                            >
                              Yes
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value="no"
                              className="flex-1 h-[50px] md:h-[55px] rounded-[35.68px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[24px] md:text-[29.6px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white"
                            >
                              No
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Languages section */}
                  <div className="flex flex-col items-start gap-3 md:gap-3.5 relative self-stretch w-full">
                    <Label className="self-stretch [font-family:'Inter',Helvetica] font-semibold text-black text-[18px] md:text-[21.6px] tracking-[0] leading-[normal]">
                      Languages*
                    </Label>
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-10 relative self-stretch w-full">
                      {/* First Language */}
                      <FormField
                        name="firstLanguage"
                        render={({ field }) => (
                          <FormItem className="relative w-full md:w-[194px]">
                            <Label className="[font-family:'Inter',Helvetica] font-normal text-black text-[16px] md:text-lg tracking-[0] leading-[normal] mb-2 block">
                              First Language
                            </Label>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full h-12 md:h-14 bg-[#d9d9d9] rounded-[47px] border border-solid border-black">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="arabic">ARABIC</SelectItem>
                                  <SelectItem value="english">English</SelectItem>
                                  <SelectItem value="french">French</SelectItem>
                                  <SelectItem value="german">German</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Second Language */}
                      <FormField
                        name="secondLanguage"
                        render={({ field }) => (
                          <FormItem className="relative w-full md:w-[194px]">
                            <Label className="[font-family:'Inter',Helvetica] font-normal text-black text-[16px] md:text-lg tracking-[0] leading-[normal] mb-2 block">
                              Second Language
                            </Label>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full h-12 md:h-14 bg-[#d9d9d9] rounded-[47px] border border-solid border-black">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="arabic">ARABIC</SelectItem>
                                  <SelectItem value="english">English</SelectItem>
                                  <SelectItem value="french">French</SelectItem>
                                  <SelectItem value="german">German</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Add More Button */}
                      <div className="relative w-full md:w-[83px] flex flex-col items-center">
                        <Label className="[font-family:'Inter',Helvetica] font-normal text-black text-[16px] md:text-lg tracking-[0] leading-[normal] mb-2 text-center">
                          ADD MORE
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-12 md:w-[54px] h-12 md:h-14 bg-[#d9d9d9] rounded-[47px] border border-solid border-black flex items-center justify-center hover:bg-[#c9c9c9]"
                        >
                          <span className="[font-family:'Inter',Helvetica] font-light text-[#505050] text-[40px] md:text-[51px] tracking-[0] leading-[normal]">
                            +
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-[90px] my-8 md:my-10">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="outline"
                  className="w-full md:w-[138px] h-[50px] md:h-[60px] rounded-[38px] text-black text-[24px] md:text-[32px] font-medium bg-[#d9d9d9] hover:bg-gray-300 transition-colors order-2 md:order-1"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="outline"
                  className="w-full md:w-[138px] h-[50px] md:h-[60px] rounded-[38px] text-white text-[24px] md:text-[32px] font-medium bg-[#151d61] hover:bg-[#1a2470] transition-colors border-[#151d61] order-1 md:order-2"
                >
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </main>
      </div>
    </div>
  )
}
