"use client"

import { ArrowLeft, Menu, X } from "lucide-react"
import React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"

// JobDetails Component
export const JobDetails = (): JSX.Element => {
  const { jobId } = useParams<{ jobId: string }>()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Navigation menu items
  const navItems = [
    { name: "SEARCH CAREERS", href: "/search-careers" },
    { name: "CAREERS", href: "/" },
  ]

  // Job data based on jobId
  const jobData = {
    1: {
      title: "Senior Civil Engineer",
      location: "Abu Dhabi, UAE",
      department: "Engineering",
      type: "Full-time",
      experience: "5+ years",
      description:
        "Lead major infrastructure projects and manage engineering teams in delivering government contracts. This function is to ensure exceptional project delivery in a highly empowered environment.",
      requirements: [
        "Bachelor's degree in Civil Engineering",
        "5+ years of experience in construction projects",
        "Project management certification preferred",
        "Strong leadership and communication skills",
        "Experience with government contracts",
      ],
      responsibilities: [
        "Lead major infrastructure projects from conception to completion",
        "Manage and mentor engineering teams",
        "Ensure compliance with safety and quality standards",
        "Coordinate with government agencies and stakeholders",
      ],
    },
    2: {
      title: "Project Manager",
      location: "Dubai, UAE",
      department: "Operations",
      type: "Full-time",
      experience: "7+ years",
      description:
        "Oversee large-scale government projects from planning to completion, ensuring quality and timely delivery. Represent our brand throughout the project journey.",
      requirements: [
        "Bachelor's degree in Engineering or related field",
        "7+ years of project management experience",
        "PMP certification required",
        "Experience with government contracts",
        "Strong leadership and communication skills",
      ],
      responsibilities: [
        "Oversee large-scale government projects",
        "Ensure quality and timely delivery",
        "Manage project budgets and resources",
        "Coordinate with multiple stakeholders",
      ],
    },
    3: {
      title: "Construction Supervisor",
      location: "Al Ain, UAE",
      department: "Construction",
      type: "Full-time",
      experience: "3+ years",
      description:
        "Supervise on-site construction activities and ensure compliance with safety and quality standards. This function is to ensure exceptional project execution.",
      requirements: [
        "Diploma in Construction or related field",
        "3+ years of construction supervision experience",
        "Knowledge of safety regulations",
        "Strong problem-solving skills",
        "Ability to work in challenging environments",
      ],
      responsibilities: [
        "Supervise on-site construction activities",
        "Ensure compliance with safety standards",
        "Monitor quality control processes",
        "Coordinate with construction teams",
      ],
    },
    4: {
      title: "Quality Control Engineer",
      location: "Dubai, UAE",
      department: "Quality Assurance",
      type: "Full-time",
      experience: "4+ years",
      description:
        "Ensure all construction work meets quality standards and regulatory requirements. Deliver a flawless project experience from start to finish.",
      requirements: [
        "Bachelor's degree in Engineering",
        "4+ years of quality control experience",
        "Knowledge of construction standards",
        "Attention to detail and analytical skills",
        "Experience with testing equipment",
      ],
      responsibilities: [
        "Ensure construction work meets quality standards",
        "Conduct regular quality inspections",
        "Prepare quality reports and documentation",
        "Coordinate with project teams on quality issues",
      ],
    },
    5: {
      title: "Safety Officer",
      location: "Abu Dhabi, UAE",
      department: "Health & Safety",
      type: "Full-time",
      experience: "3+ years",
      description:
        "Implement and monitor safety protocols across all construction sites to ensure worker safety. This function is to ensure exceptional safety standards in a highly empowered environment.",
      requirements: [
        "Bachelor's degree in Safety Engineering or related field",
        "3+ years of safety management experience",
        "NEBOSH certification preferred",
        "Knowledge of safety regulations",
        "Strong communication and training skills",
      ],
      responsibilities: [
        "Implement and monitor safety protocols",
        "Conduct safety training sessions",
        "Investigate accidents and incidents",
        "Ensure compliance with safety regulations",
      ],
    },
  }

  const job = jobData[Number.parseInt(jobId || "1")] || jobData[1]

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1282px] relative min-h-[973px]">
        {/* Header/Navigation */}
        <header className="fixed w-full h-[70px] md:h-[91px] top-0 left-0 bg-[#ebebeb] z-50">
          <div className="flex items-center justify-between px-4 md:px-[68px] h-full">
            {/* Logo and Back Button */}
            <div className="flex items-center">
              <img
                className="w-[140px] h-[75px] md:w-[200px] md:h-[105px] mx-[134px]"
                alt="EL RACE Logo"
                src="https://elrace.com/RCC4/Requirements/IMG/Logonew.gif"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between">
              <nav className="flex items-center gap-[20px] md:gap-[34px]">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[16px] md:text-[18.7px] whitespace-nowrap hover:text-[#151d61] transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-[29px] ml-[60px]">
                {/* Removed Sign In and Arabic Language buttons */}
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
                {/* Removed Sign In and Arabic Language buttons */}
              </nav>
            </div>
          )}
        </header>

        {/* Back Button */}
        <div className="absolute top-[80px] md:top-[100px] left-4 md:left-[85px] z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 md:gap-2 text-[#656565] hover:text-[#151d61] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="[font-family:'Tajawal',Helvetica] font-normal text-[14px] md:text-[18px]">Back</span>
          </button>
        </div>

        {/* Job Title */}
        <h1 className="absolute top-[100px] md:top-[136px] left-0 right-0 mx-auto [font-family:'Inter',Helvetica] font-bold text-black text-[14px] md:text-[30.8px] text-center tracking-[0] leading-tight px-4">
          {job.title}
          <br />
          {job.location}
        </h1>

        {/* Job Description */}
        <Card className="absolute w-[95%] md:w-[1084px] top-[180px] md:top-[248px] left-1/2 transform -translate-x-1/2 border-none shadow-none">
          <CardContent className="p-4 md:p-0 [font-family:'Inter',Helvetica] font-normal text-black text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] text-justify tracking-[0] leading-normal">
            <h2 className="font-bold text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] mb-3 md:mb-4">
              Job Description
            </h2>

            <p className="font-light mb-3 md:mb-6 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] leading-relaxed">
              <span className="font-semibold">About the Position</span>
              <br />
              {job.description}
            </p>

            <div className="mb-3 md:mb-6">
              <p className="font-light text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]">
                <strong>Department:</strong> {job.department} | <strong>Type:</strong> {job.type} |{" "}
                <strong>Experience:</strong> {job.experience}
              </p>
            </div>

            <h2 className="mt-3 md:mt-4 mb-2 md:mb-3 sm:text-[12px] md:text-[14px] lg:text-[16px] font-semibold text-sm">
              What you will need to Success
            </h2>

            <ul className="list-disc pl-4 md:pl-6 font-light mb-3 md:mb-6 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] space-y-1">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="mb-1">
                  {requirement}
                </li>
              ))}
            </ul>

            <h2 className="mt-3 md:mt-4 mb-2 md:mb-3 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] font-semibold">
              Key Responsibilities
            </h2>

            <ul className="list-disc pl-4 md:pl-6 font-light mb-4 md:mb-8 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] space-y-1">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index} className="mb-1">
                  {responsibility}
                </li>
              ))}
            </ul>

            {/* Apply Button */}
            <div className="flex justify-center mt-4 md:mt-8">
              <Button
                onClick={() => router.push(`/job-application/${jobId}`)}
                className="w-[110px] md:w-[160px] h-[35px] md:h-[50px] bg-[#151d61] rounded-[16.04px] [font-family:'Tajawal',Helvetica] font-bold text-white text-[16px] md:text-[28px] hover:bg-[#1a2470] transition-colors"
              >
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
