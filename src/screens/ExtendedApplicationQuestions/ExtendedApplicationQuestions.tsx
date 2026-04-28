"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { cn } from "../../lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import type { JSX } from "react/jsx-runtime"

export const ExtendedApplicationQuestions = (): JSX.Element => {
  const router = useRouter()
  const { jobId } = useParams<{ jobId: string }>()

  // State for form data
  const [previousWork, setPreviousWork] = useState("")
  const [workDetails, setWorkDetails] = useState("")
  const [relativesOrFriends, setRelativesOrFriends] = useState("")
  const [names, setNames] = useState("")
  const [selectedRelationship, setSelectedRelationship] = useState("")

  const navItems = [
    { name: "HOME", href: "https://elrace.com/" },
    { name: "PROJECTS", href: "https://elrace.com/projects" },
    { name: "CAREERS", href: "/" },
    { name: "CONTACT", href: "https://elrace.com/" },
  ]

  // Relationship options data
  const relationshipOptions = ["Father", "Mother", "Brother", "Sister", "Spouse", "Uncle", "Aunt", "Friend"]

  const handleRelationshipToggle = (relationship: string) => {
    setSelectedRelationship(relationship)
  }

  const handleSubmit = () => {
    // Validate required fields
    if (!previousWork) {
      alert("Please answer: Did you previously work with EL RACE?")
      return
    }

    if (previousWork === "yes" && !workDetails) {
      alert("Please provide details about your previous work with EL RACE")
      return
    }

    if (!relativesOrFriends) {
      alert("Please answer: Do you have relatives/friends working with EL RACE?")
      return
    }

    if (relativesOrFriends === "yes" && !names) {
      alert("Please provide names of your relatives/friends working with EL RACE")
      return
    }

    if (relativesOrFriends === "yes" && !selectedRelationship) {
      alert("Please select the relationship of your relatives/friends")
      return
    }

    const formData = {
      previousWork,
      workDetails,
      relativesOrFriends,
      names,
      selectedRelationship,
    }
    localStorage.setItem("extendedQuestions", JSON.stringify(formData))
    console.log("Extended application questions submitted:", formData)
    router.push(`/add-experience/${jobId}`)
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-row justify-center w-full bg-white">
      <div className="bg-[linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)] w-[1280px] relative">
        <header className="fixed top-0 left-0 w-full h-[90px] md:h-[115px] bg-white/90 backdrop-blur-sm z-50">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 md:px-[103px] h-full">
            <Link
              href="/"
              className="absolute left-[65px] top-[5px] md:top-[8px] flex items-center justify-center overflow-hidden -ml-[35px]"
            >
              <img
                className="w-[140px] h-[92px] object-contain md:w-[200px] md:h-[130px] scale-[1.6] brightness-[1.21] saturate-[0.8]"
                alt="EL RACE Logo"
                src="/images/design-mode/Logonew.gif"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-[42px] mr-[180px] ml-auto">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="font-medium text-[#484848] text-[18.7px] hover:text-[#ce363a] hover:scale-[1.2] transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
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

          {/* Mobile Navigation Menu */}
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

        <main className="px-4 md:px-[80px] pt-[105px] md:pt-[130px] pb-[50px] md:pb-[80px]">
          {/* Page Title */}
          <div className="mb-8 md:mb-10">
            <h1 className="w-full text-center [font-family:'Inter',Helvetica] font-bold text-[#151d61] text-[9px] md:text-[18px]">
              APPLICATION QUESTIONS
            </h1>
          </div>

          {/* Previous Work Question */}
          <section className="mb-[20px] md:mb-[40px]">
            <Label className="[font-family:'Inter',Helvetica] font-semibold text-black text-[13px] md:text-[16px] mb-[12px] md:mb-[20px]">
              Have you previously worked with EL RACE
            </Label>

            <div className="flex gap-[12px] md:gap-[20px]">
              <Button
                variant="outline"
                onClick={() => setPreviousWork("yes")}
                className={cn(
                  "w-[60px] md:w-[80px] h-[28px] md:h-[38px] bg-[#d9d9d9] rounded-[35.66px] [font-family:'Inter',Helvetica] font-semibold text-black text-[12px] md:text-[18px] hover:bg-[#c9c9c9] transition-colors px-3 md:px-6 border-none",
                  previousWork === "yes" && "bg-[#151d61] text-white hover:bg-[#1a2470]",
                )}
              >
                Yes
              </Button>
              <Button
                variant="outline"
                onClick={() => setPreviousWork("no")}
                className={cn(
                  "w-[60px] md:w-[80px] h-[28px] md:h-[38px] bg-[#d9d9d9] rounded-[35.68px] [font-family:'Inter',Helvetica] font-semibold text-black text-[12px] md:text-[18px] hover:bg-[#c9c9c9] transition-colors px-3 md:px-6 border-none",
                  previousWork === "no" && "bg-[#151d61] text-white hover:bg-[#1a2470]",
                )}
              >
                No
              </Button>
            </div>
          </section>

          {/* Conditional Work Details Section */}
          {previousWork === "yes" && (
            <section className="mb-[30px] md:mb-[60px]">
              <Label className="[font-family:'Inter',Helvetica] font-semibold text-black text-[13px] md:text-[16px] mb-[6px] md:mb-[10px]">
                Please give details about your work with EL RACE
              </Label>
              <Textarea
                value={workDetails}
                onChange={(e) => setWorkDetails(e.target.value)}
                className="w-full h-[80px] md:h-[120px] bg-white rounded-[79px] border border-solid border-[#d9d9d9] text-sm md:text-base px-4 md:px-6"
                placeholder="Describe your previous work experience with EL RACE..."
              />
            </section>
          )}

          {/* Relatives/Friends Question */}
          <section className="mb-[30px] md:mb-[60px]">
            <Label className="[font-family:'Inter',Helvetica] font-semibold text-black text-[13px] md:text-[16px] mb-[12px] md:mb-[20px]">
              Do you have any Relatives/Friends working with EL RACE
            </Label>

            <div className="flex gap-[12px] md:gap-[20px]">
              <Button
                variant="outline"
                onClick={() => setRelativesOrFriends("yes")}
                className={cn(
                  "w-[60px] md:w-[80px] h-[28px] md:h-[38px] bg-[#d9d9d9] rounded-[35.66px] [font-family:'Inter',Helvetica] font-semibold text-black text-[12px] md:text-[18px] hover:bg-[#c9c9c9] transition-colors px-3 md:px-6 border-none",
                  relativesOrFriends === "yes" && "bg-[#151d61] text-white hover:bg-[#1a2470]",
                )}
              >
                Yes
              </Button>
              <Button
                variant="outline"
                onClick={() => setRelativesOrFriends("no")}
                className={cn(
                  "w-[60px] md:w-[80px] h-[28px] md:h-[38px] bg-[#d9d9d9] rounded-[35.68px] [font-family:'Inter',Helvetica] font-semibold text-black text-[12px] md:text-[18px] hover:bg-[#c9c9c9] transition-colors px-3 md:px-6 border-none",
                  relativesOrFriends === "no" && "bg-[#151d61] text-white hover:bg-[#1a2470]",
                )}
              >
                No
              </Button>
            </div>

            {/* Conditional Names and Relationship Section */}
            {relativesOrFriends === "yes" && (
              <div className="mt-[20px] md:mt-[40px]">
                <Label className="[font-family:'Inter',Helvetica] font-semibold text-black text-[13px] md:text-[16px] mb-[6px] md:mb-[10px]">
                  Please specify the names of Relatives/Friends
                </Label>
                <Input
                  value={names}
                  onChange={(e) => setNames(e.target.value)}
                  className="w-full h-[40px] md:h-[60px] bg-white rounded-[79px] border border-solid border-[#d9d9d9] text-sm md:text-base px-4 md:px-6"
                  placeholder="Enter names of relatives/friends..."
                />

                {/* Relationship Section */}
                <div className="mt-[20px] md:mt-[40px]">
                  <Label className="[font-family:'Inter',Helvetica] font-normal text-black text-[13px] md:text-[16px] mb-[12px] md:mb-[20px]">
                    Relationship
                  </Label>

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
