"use client"

import React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, LogInIcon, Menu, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group"
import Link from "next/link"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

export const ApplicationQuestions = (): JSX.Element => {
  const router = useRouter()
  const { jobId } = useParams<{ jobId: string }>()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Simple state management without form validation
  const [previouslyWorked, setPreviouslyWorked] = React.useState("")
  const [relativesOrFriends, setRelativesOrFriends] = React.useState("")

  // Navigation menu items
  const navItems = [
    { name: "HOME", href: "/" },
    { name: "PROJECTS", href: "#" },
    { name: "BLOGS", href: "#" },
    { name: "CONTACTS", href: "#" },
    { name: "SEARCH CAREERS", href: "/search-careers" },
    { name: "CAREERS", href: "/" },
  ]

  const handleSubmit = () => {
    console.log("Application questions submitted:", { previouslyWorked, relativesOrFriends })
    // Navigate to extended application questions page
    router.push(`/extended-application-questions/${jobId}`)
  }

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1280px] relative min-h-screen">
        {/* Header/Navigation */}
        <header className="absolute w-full h-[91px] top-0 left-0 bg-[#ebebeb]">
          <div className="flex items-center justify-between px-4 md:px-[68px] h-full">
            {/* Logo and Back Button */}
            <div className="flex items-center">
              <img className="w-[120px] h-[54px] md:w-[150px] md:h-[68px]" alt="EL RACE Logo" src="/pre-comp-2-1.svg" />
              <button
                onClick={() => router.back()}
                className="ml-2 md:ml-4 flex items-center gap-1 md:gap-2 text-[#656565] hover:text-[#151d61] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                <span className="[font-family:'Tajawal',Helvetica] font-normal text-[16px] md:text-[18px]">Back</span>
              </button>
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
                    <LogInIcon className="w-[20px] h-[20px]" />
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
          <Card className="w-full border-none shadow-none mb-8 md:mb-12">
            <CardContent className="p-0 text-center">
              <h1 className="font-sans font-bold text-[18px] sm:text-[24px] md:text-[33.6px] text-[#151d61] tracking-normal">
                application questions
              </h1>
            </CardContent>
          </Card>

          {/* Application Questions Form */}
          <div className="space-y-8 md:space-y-12">
            <div className="flex flex-col w-full items-start gap-8 md:gap-[60px] relative max-w-[800px] mx-auto">
              {/* Question 1: Previously worked with EL RACE */}
              <div className="flex flex-col items-start gap-4 md:gap-8 relative self-stretch w-full">
                <Label className="self-stretch [font-family:'Inter',Helvetica] font-semibold text-black text-[14px] sm:text-[18px] md:text-[24px] tracking-[0] leading-[normal]">
                  Have you previously worked with EL RACE
                </Label>
                <ToggleGroup
                  type="single"
                  value={previouslyWorked}
                  onValueChange={setPreviouslyWorked}
                  className="flex w-full items-center gap-4 md:gap-8 relative justify-start"
                >
                  <ToggleGroupItem
                    value="yes"
                    className="w-[80px] sm:w-[100px] md:w-[120px] h-[40px] sm:h-[50px] md:h-[60px] rounded-[30px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[16px] sm:text-[20px] md:text-[24px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470] transition-colors"
                  >
                    yes
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="no"
                    className="w-[80px] sm:w-[100px] md:w-[120px] h-[40px] sm:h-[50px] md:h-[60px] rounded-[30px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[16px] sm:text-[20px] md:text-[24px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470] transition-colors"
                  >
                    No
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Question 2: Relatives/Friends working with EL RACE */}
              <div className="flex flex-col items-start gap-4 md:gap-8 relative self-stretch w-full">
                <Label className="self-stretch [font-family:'Inter',Helvetica] font-semibold text-black text-[14px] sm:text-[18px] md:text-[24px] tracking-[0] leading-[normal]">
                  Do you have any Relatives/Friends working with EL RACE
                </Label>
                <ToggleGroup
                  type="single"
                  value={relativesOrFriends}
                  onValueChange={setRelativesOrFriends}
                  className="flex w-full items-center gap-4 md:gap-8 relative justify-start"
                >
                  <ToggleGroupItem
                    value="yes"
                    className="w-[80px] sm:w-[100px] md:w-[120px] h-[40px] sm:h-[50px] md:h-[60px] rounded-[30px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[16px] sm:text-[20px] md:text-[24px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470] transition-colors"
                  >
                    yes
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="no"
                    className="w-[80px] sm:w-[100px] md:w-[120px] h-[40px] sm:h-[50px] md:h-[60px] rounded-[30px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[16px] sm:text-[20px] md:text-[24px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470] transition-colors"
                  >
                    No
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-[90px] my-12 md:my-16">
              <Button
                type="button"
                onClick={() => router.back()}
                variant="outline"
                className="w-full md:w-[138px] h-[40px] sm:h-[50px] md:h-[60px] rounded-[38px] text-black text-[18px] sm:text-[24px] md:text-[32px] font-medium bg-[#d9d9d9] hover:bg-gray-300 transition-colors border-[#d9d9d9] order-2 md:order-1"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                variant="outline"
                className="w-full md:w-[138px] h-[40px] sm:h-[50px] md:h-[60px] rounded-[38px] text-white text-[18px] sm:text-[24px] md:text-[32px] font-medium bg-[#151d61] hover:bg-[#1a2470] transition-colors border-[#151d61] order-1 md:order-2"
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