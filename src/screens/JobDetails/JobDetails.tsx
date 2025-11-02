"use client"

import { Menu, X } from "lucide-react"
import React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import type { JSX } from "react/jsx-runtime"

// JobDetails Component
export const JobDetails = (): JSX.Element => {
  const { jobId } = useParams<{ jobId: string }>()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [jobData, setJobData] = React.useState<any>(null)

  const navItems = [
    { name: "HOME", href: "https://elrace.com/" },
    { name: "PROJECTS", href: "https://elrace.com/projects" },
    { name: "CAREERS", href: "/" },
    { name: "CONTACT", href: "https://elrace.com/" },
  ]

  const jobReferenceNumbers: Record<number, string> = {
    1: "RCC1001",
    2: "RCC1002",
    3: "RCC1003",
    4: "RCC1004",
    5: "RCC1005",
  }

  const hardcodedJobData = {
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

  React.useEffect(() => {
    const storedJobData = localStorage.getItem("selectedJobData")
    if (storedJobData) {
      try {
        const parsedJob = JSON.parse(storedJobData)
        console.log("[v0] Loaded job data from localStorage:", parsedJob)
        setJobData(parsedJob)
      } catch (error) {
        console.error("[v0] Error parsing job data:", error)
        // Use fallback hardcoded data
        setJobData(hardcodedJobData[Number.parseInt(jobId || "1")] || hardcodedJobData[1])
      }
    } else {
      // Use fallback hardcoded data
      console.log("[v0] No job data in localStorage, using fallback")
      setJobData(hardcodedJobData[Number.parseInt(jobId || "1")] || hardcodedJobData[1])
    }
  }, [jobId])

  const job = jobData || hardcodedJobData[1]

  React.useEffect(() => {
    if (job && job.title) {
      const referenceNumber = job.referenceNumber || jobReferenceNumbers[Number.parseInt(jobId || "1")] || "RCC1001"

      localStorage.setItem("jobTitle", job.title)
      localStorage.setItem("jobName", job.title)
      localStorage.setItem("jobReferenceNumber", referenceNumber)
      console.log("[v0] Stored job title in localStorage:", job.title)
      console.log("[v0] Stored job reference number in localStorage:", referenceNumber)
    }
  }, [job, jobId])

  if (!jobData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading job details...</p>
      </div>
    )
  }

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1282px] relative min-h-[973px]">
        <header className="fixed w-full h-[85px] md:h-[110px] top-0 left-0 bg-white/90 backdrop-blur-sm z-50">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 md:px-[103px] h-full">
            <Link
              href="/"
              className="absolute left-[85px] top-[5px] md:top-[8px] flex items-center justify-center overflow-hidden"
            >
              <img
                className="w-[140px] h-[92px] object-contain md:w-[200px] md:h-[130px] scale-[1.6] brightness-[1.21] saturate-[0.8]"
                alt="EL RACE Logo"
                src="/images/design-mode/Logonew.gif"
              />
            </Link>
            <div className="hidden lg:flex items-center gap-[42px] mr-[60px] ml-auto">
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
            <div className="lg:hidden fixed top-[85px] left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
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

        {/* Job Title */}
        <h1 className="absolute top-[115px] md:top-[146px] left-0 right-0 mx-auto [font-family:'Inter',Helvetica] font-bold text-black text-[14px] md:text-[30.8px] text-center tracking-[0] leading-tight px-4">
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
              {job.description}
            </p>

            <h2 className="font-bold text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] mb-2 md:mb-3">
              About the Job
            </h2>

            <ul className="list-disc pl-4 md:pl-6 font-light mb-3 md:mb-6 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] space-y-1">
              <li className="mb-1">
                <strong>Department:</strong> {job.department}
              </li>
              <li className="mb-1">
                <strong>Type:</strong> {job.type}
              </li>
              <li className="mb-1">
                <strong>Experience:</strong> {job.experience}
              </li>
              <li className="mb-1">
                <strong>Location:</strong> {job.location}
              </li>
            </ul>

            {job.requirements && job.requirements.length > 0 && (
              <>
                <h2 className="mt-3 md:mt-4 mb-2 md:mb-3 sm:text-[12px] md:text-[14px] lg:text-[18px] font-semibold text-sm">
                  What you will need to Success
                </h2>

                <ul className="list-disc pl-4 md:pl-6 font-light mb-3 md:mb-6 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] space-y-1">
                  {job.requirements.map((requirement: string, index: number) => (
                    <li key={index} className="mb-1">
                      {requirement}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {job.responsibilities && job.responsibilities.length > 0 && (
              <>
                <h2 className="mt-3 md:mt-4 mb-2 md:mb-3 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[18px] font-bold">
                  Key Responsibilities
                </h2>

                <ul className="list-disc pl-4 md:pl-6 font-light mb-4 md:mb-8 text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] space-y-1">
                  {job.responsibilities.map((responsibility: string, index: number) => (
                    <li key={index} className="mb-1">
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Apply Button */}
            <div className="flex justify-center mt-0 md:mt-2 mb-8 md:mb-12">
              <Button
                onClick={() => router.push(`/job-application/${jobId}`)}
                className="w-[90px] md:w-[130px] h-[30px] md:h-[40px] bg-[#151d61] rounded-[16.04px] [font-family:'Tajawal',Helvetica] font-bold text-white text-[14px] md:text-[20px] hover:bg-[#1a2470] transition-colors"
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
