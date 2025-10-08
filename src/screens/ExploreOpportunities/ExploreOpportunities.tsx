"use client"

import {
  ArrowLeft,
  ArrowDownIcon,
  ArrowUpIcon,
  ListIcon,
  MapPinIcon,
  ChevronDownIcon,
  SearchIcon,
  Menu,
  X,
} from "lucide-react"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Separator } from "../../components/ui/separator" // Import Separator component
import type { JSX } from "react"

export const ExploreOpportunities = (): JSX.Element => {
  const router = useRouter()

  // State for filters
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Navigation menu items
  const navItems = [
    { label: "SEARCH CAREERS", href: "/search-careers" },
    { label: "CAREERS", href: "/" },
  ]

  // Job listings data
  const jobListings = [
    {
      id: 1,
      referenceNumber: "RCC1001", // Updated from RCC0001 to RCC1001
      title: "Senior Civil Engineer",
      department: "Engineering",
      location: "Abu Dhabi, UAE",
      type: "Full-time",
      experience: "5+ years",
      postingDate: "07/04/2025",
      description:
        "Lead major infrastructure projects and manage engineering teams in delivering government contracts. This function is to ensure exceptional project delivery in a highly empowered environment.",
      requirements: [
        "Bachelor's degree in Civil Engineering",
        "5+ years of experience in construction projects",
        "Project management certification preferred",
        "Strong leadership and communication skills",
      ],
    },
    {
      id: 2,
      referenceNumber: "RCC1002", // Updated from RCC0002 to RCC1002
      title: "Project Manager",
      department: "Operations",
      location: "Dubai, UAE",
      type: "Full-time",
      experience: "7+ years",
      postingDate: "07/04/2025",
      description:
        "Oversee large-scale government projects from planning to completion, ensuring quality and timely delivery. Represent our brand throughout the project journey.",
      requirements: [
        "Bachelor's degree in Engineering or related field",
        "7+ years of project management experience",
        "PMP certification required",
        "Experience with government contracts",
      ],
    },
    {
      id: 3,
      referenceNumber: "RCC1003", // Updated from RCC0003 to RCC1003
      title: "Construction Supervisor",
      department: "Construction",
      location: "Al Ain, UAE",
      type: "Full-time",
      experience: "3+ years",
      postingDate: "07/04/2025",
      description:
        "Supervise on-site construction activities and ensure compliance with safety and quality standards. This function is to ensure exceptional project execution.",
      requirements: [
        "Diploma in Construction or related field",
        "3+ years of construction supervision experience",
        "Knowledge of safety regulations",
        "Strong problem-solving skills",
      ],
    },
    {
      id: 4,
      referenceNumber: "RCC1004", // Updated from RCC0004 to RCC1004
      title: "Quality Control Engineer",
      department: "Quality Assurance",
      location: "Dubai, UAE",
      type: "Full-time",
      experience: "4+ years",
      postingDate: "07/04/2025",
      description:
        "Ensure all construction work meets quality standards and regulatory requirements. Deliver a flawless project experience from start to finish.",
      requirements: [
        "Bachelor's degree in Engineering",
        "4+ years of quality control experience",
        "Knowledge of construction standards",
        "Attention to detail and analytical skills",
      ],
    },
    {
      id: 5,
      referenceNumber: "RCC1005", // Updated from RCC0005 to RCC1005
      title: "Safety Officer",
      department: "Health & Safety",
      location: "Abu Dhabi, UAE",
      type: "Full-time",
      experience: "3+ years",
      postingDate: "07/04/2025",
      description:
        "Implement and monitor safety protocols across all construction sites to ensure worker safety. This function is to ensure exceptional safety standards in a highly empowered environment.",
      requirements: [
        "Bachelor's degree in Safety Engineering or related field",
        "3+ years of safety management experience",
        "NEBOSH certification preferred",
        "Knowledge of safety regulations",
      ],
    },
  ]

  const handleJobClick = (jobId: number) => {
    router.push(`/job-details/${jobId}`)
  }

  // Filter and sort jobs based on current filters
  const filteredAndSortedJobs = React.useMemo(() => {
    let filtered = jobListings

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(selectedLocation.toLowerCase()))
    }

    // Sort by posting date
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.postingDate.split("/").reverse().join("-"))
      const dateB = new Date(b.postingDate.split("/").reverse().join("-"))

      return sortOrder === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
    })

    return sorted
  }, [searchTerm, selectedLocation, sortOrder, jobListings])

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
  }

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1280px] flex flex-col">
        {/* Header/Navigation */}
        <header className="w-full h-[70px] md:h-[91px] bg-white relative z-50">
          <div className="flex items-center justify-between px-4 md:px-[103px] h-full">
            {/* Company Logo */}
            <img
              className="w-[140px] h-[75px] md:w-[200px] md:h-[105px]"
              alt="EL RACE Logo"
              src="/images/design-mode/Logonew.gif"
            />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between">
              <nav className="flex items-center gap-[34px] mr-[29px]">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[18.7px] tracking-[0] leading-[normal] whitespace-nowrap hover:text-[#151d61] transition-colors"
                  >
                    {item.label}
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
                    className="py-3 px-2 [font-family:'Tajawal',Helvetica] font-normal text-[#656565] text-[16px] md:text-[18px] transition-colors hover:text-[#151d61]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* Page Header */}
        <section className="relative h-28 md:h-48 w-full">
          <div className="h-28 md:h-48 bg-[url(/rectangle-1.svg)] bg-cover bg-[50%_50%] absolute w-full">
            <div className="h-28 md:h-48 bg-[linear-gradient(90deg,rgba(0,7,69,0.8)_45%,rgba(84,93,179,0.8)_100%)] absolute w-full">
              <div className="absolute top-4 md:top-6 left-4 md:left-[103px]">
                <Link
                  href="/search-careers"
                  className="flex items-center gap-2 md:gap-3 text-white hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="[font-family:'Tajawal',Helvetica] font-normal text-[14px] md:text-[18px]">
                    Back to Search
                  </span>
                </Link>
              </div>

              <h1 className="absolute top-[35px] md:top-[60px] left-1/2 transform -translate-x-1/2 [font-family:'Times_New_Roman-Regular',Helvetica] font-normal text-white text-[16px] md:text-[36px] tracking-[0] leading-normal text-center px-4">
                <span className="font-bold tracking-wider whitespace-nowrap">EXPLORE OPPORTUNITIES</span>
              </h1>

              <p className="absolute w-[90%] md:w-[800px] top-[55px] md:top-[110px] left-1/2 transform -translate-x-1/2 [font-family:'Tajawal',Helvetica] font-normal text-white text-[8px] md:text-[16px] text-center tracking-[0] leading-normal px-4">
                Join our team of dedicated professionals and be part of UAE's leading construction company
              </p>
            </div>
            <div className="h-[17px] bottom-0 absolute w-full bg-[#9e3442]" />
          </div>
        </section>

        {/* Main content area */}
        <main className="w-full flex flex-col">
          {/* Search Filter Section */}
          <div className="w-full max-w-[550px] mx-auto mt-4 md:mt-6 px-2">
            <Card className="rounded-[9px] border-2 border-[#6b6b6b] overflow-hidden shadow-lg">
              {/* Mobile Layout */}
              <div className="md:hidden">
                <div className="flex flex-col">
                  <div className="flex flex-col px-4 py-4">
                    <div className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#6b6b6b] text-[14px] tracking-[0]">
                      FIND JOBS
                    </div>
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mt-2 border-none p-0 h-auto shadow-none bg-white [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-black text-[16px] tracking-[0] placeholder:text-black focus-visible:ring-0"
                      placeholder="Job title, skill, keyword"
                    />
                  </div>
                  <Separator orientation="horizontal" className="h-[1px]" />
                  <div className="flex flex-col px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#6b6b6b] text-[14px] tracking-[0]">
                        NEAR LOCATIONS
                      </div>
                      <ChevronDownIcon className="w-[12.99px] h-[11.25px] text-[#6b6b6b]" />
                    </div>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="mt-2 border-none p-0 h-auto shadow-none bg-white [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-black text-[13px] tracking-[0] focus-visible:ring-0 bg-transparent">
                        <SelectValue placeholder="city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="abu-dhabi">Abu Dhabi</SelectItem>
                        <SelectItem value="dubai">Dubai</SelectItem>
                        <SelectItem value="al-ain">Al Ain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => {
                      console.log("Search triggered with:", { searchTerm, selectedLocation })
                    }}
                    className="w-full h-[50px] rounded-none bg-[#e6e6e6] hover:bg-[#d9d9d9] border-t-2 border-[#6b6b6b]"
                    variant="ghost"
                  >
                    <SearchIcon className="w-[28px] h-[28px] text-black" />
                  </Button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex h-[90px]">
                <div className="flex-1 flex flex-col justify-center px-[25px]">
                  <div className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#6b6b6b] text-[14px] tracking-[0]">
                    Find jobs
                  </div>
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-2 border-none p-0 h-auto shadow-none bg-white [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-black text-[16px] tracking-[0] placeholder:text-black focus-visible:ring-0"
                    placeholder="Job title, skill, keyword"
                  />
                </div>
                <Separator orientation="vertical" className="h-[40px] my-auto" />
                <div className="flex-1 flex flex-col justify-center px-[25px]">
                  <div className="flex items-center justify-between">
                    <div className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#6b6b6b] text-[14px] tracking-[0]">
                      Near locations
                    </div>
                  </div>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="mt-2 border-none p-0 h-auto shadow-none bg-white [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-black text-[13px] tracking-[0] focus-visible:ring-0 bg-transparent">
                      <SelectValue placeholder="city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abu-dhabi">Abu Dhabi</SelectItem>
                      <SelectItem value="dubai">Dubai</SelectItem>
                      <SelectItem value="al-ain">Al Ain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => {
                    console.log("Search triggered with:", { searchTerm, selectedLocation })
                  }}
                  className="w-[130px] h-full rounded-none rounded-r-[9px] bg-[#e6e6e6] hover:bg-[#d9d9d9] border-l-2 border-[#6b6b6b]"
                  variant="ghost"
                >
                  <SearchIcon className="w-[32px] h-[32px] text-black" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Filter controls */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-[19.29px] px-4 md:px-0 md:ml-auto md:mr-[103px] mt-6 md:mt-8 relative">
            <button
              onClick={handleSortToggle}
              className="flex items-end gap-[10.39px] hover:opacity-80 transition-opacity"
            >
              <div className="[font-family:'Inter',Helvetica] font-normal text-[#4d4d4d] text-[14px] md:text-[17.8px]">
                Posting Date {sortOrder === "desc" ? "(Newest First)" : "(Oldest First)"}
              </div>
              {sortOrder === "desc" ? (
                <ArrowDownIcon className="w-[10.93px] h-[18.55px] text-[#4d4d4d]" />
              ) : (
                <ArrowUpIcon className="w-[10.93px] h-[18.55px] text-[#4d4d4d]" />
              )}
            </button>

            <div className="h-[40.07px] rounded-[8.91px] border-[1.48px] border-solid border-[#a4a4a4] flex">
              <button
                onClick={() => setViewMode("list")}
                className={`w-[60px] md:w-[67px] h-10 rounded-[8.91px_0px_0px_8.91px] flex items-center justify-center transition-colors ${
                  viewMode === "list" ? "bg-[#d9d9d9]" : "bg-transparent hover:bg-[#d9d9d9]"
                }`}
              >
                <ListIcon className="w-[18px] md:w-[21px] h-[18px] md:h-[21px]" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`w-[60px] md:w-[67px] h-10 flex items-center justify-center transition-colors ${
                  viewMode === "map" ? "bg-[#d9d9d9]" : "bg-transparent hover:bg-[#d9d9d9]"
                }`}
              >
                <MapPinIcon className="w-[18px] md:w-[21px] h-[18px] md:h-[21px]" />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="px-4 md:px-0 md:ml-[103px] mt-4">
            <p className="[font-family:'Inter',Helvetica] font-normal text-[#4d4d4d] text-[14px] md:text-[16px]">
              Showing {filteredAndSortedJobs.length} of {jobListings.length} jobs
            </p>
          </div>

          {/* Job Details Section */}
          <section className="flex flex-col w-full max-w-[1056px] items-start gap-4 md:gap-7 mx-auto mt-6 md:mt-8 px-4 mb-12 md:mb-16">
            {filteredAndSortedJobs.length > 0 ? (
              filteredAndSortedJobs.map((job, index) => (
                <button
                  key={index}
                  onClick={() => handleJobClick(job.id)}
                  className="w-full min-h-[160px] md:h-[220px] bg-white border border-black rounded-lg p-4 md:p-6 text-left hover:bg-gray-200 transition-colors cursor-pointer shadow-sm"
                >
                  <div className="w-full h-full">
                    <div className="w-full [font-family:'Arimo_Hebrew_Subset-Bold',Helvetica]">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-black text-[18px] md:text-[24.2px] leading-tight">{job.title}</h3>
                        <span className="text-[#151d61] font-semibold text-[12px] md:text-[14px] bg-blue-50 px-3 py-1 rounded-full">
                          {job.referenceNumber}
                        </span>
                      </div>

                      <p className="[font-family:'Tajawal_Medium-Regular',Helvetica] text-[#2d2d2d] text-[12px] md:text-base mb-2 md:mb-3">
                        Location: {job.location}&nbsp;&nbsp;Posting Date: {job.postingDate}&nbsp;&nbsp;
                      </p>

                      <h4 className="[font-family:'Arimo',Helvetica] font-bold text-black text-[12px] md:text-[15px] mt-2 md:mt-4 mb-1 md:mb-2">
                        About the Job
                      </h4>

                      <p className="[font-family:'Tajawal_Medium-Regular',Helvetica] text-black text-[11px] md:text-[15px] line-clamp-3 md:line-clamp-none leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="w-full text-center py-12 md:py-16">
                <p className="[font-family:'Inter',Helvetica] font-normal text-[#4d4d4d] text-[14px] md:text-[18px] px-4">
                  No jobs found matching your criteria. Try adjusting your search filters.
                </p>
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#151d61] text-white px-4 md:px-[103px] py-6 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <img
                className="w-[80px] h-[36px] md:w-[120px] md:h-[54px] mb-3 md:mb-4 brightness-0 invert"
                alt="EL RACE Logo"
                src="/pre-comp-2-1.svg"
              />
              <p className="[font-family:'Tajawal',Helvetica] text-[11px] md:text-[14px] text-gray-300 leading-relaxed">
                Building UAE's future with over 40 years of excellence in construction and infrastructure development.
              </p>
            </div>
            <div>
              <h3 className="[font-family:'Tajawal',Helvetica] font-semibold text-[14px] md:text-[18px] mb-3 md:mb-4">
                Quick Links
              </h3>
              <ul className="space-y-1 md:space-y-2">
                <li>
                  <Link
                    href="/"
                    className="[font-family:'Tajawal',Helvetica] text-[11px] md:text-[14px] text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
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
                <li>
                  <a
                    href="#"
                    className="[font-family:'Tajawal',Helvetica] text-[11px] md:text-[14px] text-gray-300 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="[font-family:'Tajawal',Helvetica] text-[11px] md:text-[14px] text-gray-300 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="[font-family:'Tajawal',Helvetica] font-semibold text-[14px] md:text-[18px] mb-3 md:mb-4">
                Contact Info
              </h3>
              <div className="space-y-1 md:space-y-2 text-[11px] md:text-[14px] text-gray-300">
                <p className="[font-family:'Tajawal',Helvetica]">EL RACE UAE</p>
                <p className="[font-family:'Tajawal',Helvetica]">600500722</p>
                <p className="[font-family:'Tajawal',Helvetica]">info@elrace.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-4 md:mt-8 pt-4 md:pt-8 text-center">
            <p className="[font-family:'Tajawal',Helvetica] text-[10px] md:text-[14px] text-gray-300">
              © 2024 EL RACE. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
