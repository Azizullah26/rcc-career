"use client"

import { ArrowLeft, Menu, X } from "lucide-react"
import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { cn } from "../../lib/utils"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "../../../components/ui/toggle-group"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

export const ExtendedApplicationQuestions = (): JSX.Element => {
  const router = useRouter()
  const { jobId } = useParams<{ jobId: string }>()

  // State for form data
  const [previousWork, setPreviousWork] = useState("")
  const [workDetails, setWorkDetails] = useState("")
  const [relativesOrFriends, setRelativesOrFriends] = useState("")
  const [names, setNames] = useState("")
  const [selectedRelationship, setSelectedRelationship] = useState("")

  // Navigation items data
  const navItems = [
    { name: "SEARCH CAREERS", href: "/search-careers" },
    { name: "CAREERS", href: "/" },
  ]

  // Relationship options data
  const relationshipOptions = ["Father", "Mother", "Brother", "Sister", "Spouse", "Uncle", "Aunt", "Friend"]

  const handleRelationshipToggle = (relationship: string) => {
    setSelectedRelationship(relationship)
  }

  const handleSubmit = () => {
    const formData = {
      previousWork,
      workDetails,
      relativesOrFriends,
      names,
      selectedRelationship,
    }
    // Store extended questions in localStorage
    localStorage.setItem("extendedQuestions", JSON.stringify(formData))
    console.log("Extended application questions submitted:", formData)
    router.push(`/add-experience/${jobId}`)
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-row justify-center w-full bg-white">
      <div className="bg-[linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)] w-[1280px] relative">
        {/* Header/Navigation Bar */}
        <header className="fixed w-full h-[70px] md:h-[91px] bg-[#ebebeb] flex items-center justify-between px-4 md:px-[68px] top-0 left-0 z-50">
          <div className="flex items-center">
            <img
              className="w-[140px] h-[75px] my-0 ml-[113px] mr-[123px] md:h-[105px] md:w-[200px]"
              alt="EL RACE Logo"
              src="/images/design-mode/Logonew.gif"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between">
            <nav className="flex items-center gap-[34px] mr-[29px]">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[18.7px] whitespace-nowrap hover:text-[#151d61] transition-colors"
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
            {isMobileMenuOpen ? <X className="w-6 h-6 text-[#151d61]" /> : <Menu className="w-6 h-6 text-[#151d61]" />}
          </button>

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
                  {/* Removed Sign In and Arabic Language buttons */}
                </div>
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="px-4 md:px-[80px] pt-[80px] md:pt-[100px] pb-[50px] md:pb-[80px]">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 md:gap-2 text-[#656565] hover:text-[#151d61] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="[font-family:'Tajawal',Helvetica] font-normal text-[12px] md:text-[16px]">Back</span>
            </button>
          </div>

          <h1 className="w-full text-center [font-family:'Inter',Helvetica] font-bold text-[#151d61] text-[9px] md:text-[18px] mb-[20px] md:mb-[60px]">
            APPLICATION QUESTIONS
          </h1>

          {/* Previous Work Question */}
          <section className="mb-[20px] md:mb-[40px]">
            <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-[13px] md:text-[16px] mb-[12px] md:mb-[20px]">
              Have you previously worked with EL RACE
            </h2>

            <ToggleGroup
              type="single"
              value={previousWork}
              onValueChange={setPreviousWork}
              className="flex gap-[12px] md:gap-[20px]"
            >
              <ToggleGroupItem
                value="yes"
                className="w-[60px] md:w-[80px] h-[28px] md:h-[38px] bg-[#d9d9d9] rounded-[35.66px] [font-family:'Inter',Helvetica] font-semibold text-black text-[12px] md:text-[18px] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470]"
              >
                yes
              </ToggleGroupItem>
              <ToggleGroupItem
                value="no"
                className="w-[60px] md:w-[80px] h-[28px] md:h-[38px] bg-[#d9d9d9] rounded-[35.68px] [font-family:'Inter',Helvetica] font-semibold text-black text-[12px] md:text-[18px] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470]"
              >
                No
              </ToggleGroupItem>
            </ToggleGroup>
          </section>

          {/* Conditional Work Details Section */}
          {previousWork === "yes" && (
            <section className="mb-[30px] md:mb-[60px]">
              <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-[13px] md:text-[16px] mb-[6px] md:mb-[10px]">
                Please give details about your work with EL RACE
              </h2>
              <Input
                value={workDetails}
                onChange={(e) => setWorkDetails(e.target.value)}
                className="w-full h-[40px] md:h-[60px] bg-white rounded-[79px] border border-solid border-[#d9d9d9] text-sm md:text-base px-4 md:px-6"
                placeholder="Describe your previous work experience with EL RACE..."
              />
            </section>
          )}

          {/* Relatives/Friends Question */}
          <section className="mb-[30px] md:mb-[60px]">
            <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-[13px] md:text-[16px] mb-[12px] md:mb-[20px]">
              Do you have any Relatives/Friends working with EL RACE
            </h2>

            <ToggleGroup
              type="single"
              value={relativesOrFriends}
              onValueChange={setRelativesOrFriends}
              className="flex gap-[12px] md:gap-[20px]"
            >
              <ToggleGroupItem
                value="yes"
                className="w-[60px] md:w-[80px] h-[28px] md:h-[38px] bg-[#d9d9d9] rounded-[35.66px] [font-family:'Inter',Helvetica] font-semibold text-black text-[12px] md:text-[18px] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470]"
              >
                yes
              </ToggleGroupItem>
              <ToggleGroupItem
                value="no"
                className="w-[60px] md:w-[80px] h-[28px] md:h-[38px] bg-[#d9d9d9] rounded-[35.68px] [font-family:'Inter',Helvetica] font-semibold text-black text-[12px] md:text-[18px] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470]"
              >
                No
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Conditional Names and Relationship Section */}
            {relativesOrFriends === "yes" && (
              <div className="mt-[20px] md:mt-[40px]">
                <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-[13px] md:text-[16px] mb-[6px] md:mb-[10px]">
                  Please specify the names of Relatives/Friends
                </h2>
                <Input
                  value={names}
                  onChange={(e) => setNames(e.target.value)}
                  className="w-full h-[40px] md:h-[60px] bg-white rounded-[79px] border border-solid border-[#d9d9d9] text-sm md:text-base px-4 md:px-6"
                  placeholder="Enter names of relatives/friends..."
                />

                {/* Relationship Section */}
                <div className="mt-[20px] md:mt-[40px]">
                  <h2 className="[font-family:'Inter',Helvetica] font-normal text-black text-[13px] md:text-[16px] mb-[12px] md:mb-[20px]">
                    Relationship
                  </h2>

                  <div className="flex flex-wrap gap-[10px] md:gap-[20px]">
                    {relationshipOptions.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleRelationshipToggle(option)}
                        className={cn(
                          "h-[28px] md:h-[36px] bg-[#d9d9d9] rounded-[30px] [font-family:'Inter',Helvetica] font-semibold text-black text-[13px] md:text-[18px] border-none hover:bg-[#c9c9c9] transition-colors px-3 md:px-6",
                          selectedRelationship === option && "bg-[#151d61] text-white hover:bg-[#1a2470]",
                        )}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-[90px] mt-[20px] md:mt-[40px]">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-full md:w-[80px] h-[28px] md:h-[35px] bg-[#d9d9d9] rounded-[38.79px] [font-family:'Inter',Helvetica] font-medium text-black text-[13px] md:text-[18px] border-none hover:bg-gray-300 transition-colors order-2 md:order-1"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleSubmit}
              className="w-full md:w-[80px] h-[28px] md:h-[35px] bg-[#151d61] rounded-[38.77px] [font-family:'Inter',Helvetica] font-medium text-white text-[13px] md:text-[18px] border border-transparent hover:bg-white hover:text-[#151d61] hover:border-black transition-colors order-1 md:order-2"
            >
              Next
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 w-full bg-[#151d61] text-white flex items-center justify-center py-4">
          <ul className="flex gap-4">
            <li>
              <a
                href="https://ae.indeed.com/cmp/Elrace-Constructions-and-General-Contracting-Co.-LLC/jobs"
                target="_blank"
                rel="noopener noreferrer"
                className="[font-family:'Tajawal',Helvetica] text-[11px] md:text-[14px] text-gray-300 hover:text-white transition-colors"
              >
                Indeed Jobs
              </a>
            </li>
            {/* Additional footer links can be added here */}
          </ul>
        </footer>
      </div>
    </div>
  )
}
