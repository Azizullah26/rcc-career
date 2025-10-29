"use client"

import { SearchIcon, Menu, X, Loader2 } from "lucide-react"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import type { JSX } from "react"

interface Job {
  id: number
  referenceNumber: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  postingDate: string
  description: string
  requirements: string[]
}

export const ExploreOpportunities = (): JSX.Element => {
  const router = useRouter()

  // State for filters
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [jobListings, setJobListings] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navItems = [
    { name: "HOME", href: "https://elrace.com/" },
    { name: "PROJECTS", href: "https://elrace.com/projects" },
    { name: "CAREERS", href: "/" },
    { name: "CONTACT", href: "https://elrace.com/" },
  ]

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log("[v0] Fetching jobs from API...")

        const response = await fetch("/api/odoo/jobs")
        const data = await response.json()

        console.log("[v0] Jobs API response:", data)

        if (data.success && data.jobs) {
          setJobListings(data.jobs)
          console.log(`[v0] Loaded ${data.jobs.length} jobs from Odoo`)
        } else {
          setError(data.error || "Failed to load jobs")
          console.error("[v0] Failed to load jobs:", data.error)
        }
      } catch (err) {
        console.error("[v0] Error fetching jobs:", err)
        setError("Failed to connect to server")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleJobClick = (jobId: number) => {
    const selectedJob = jobListings.find((job) => job.id === jobId)
    if (selectedJob) {
      localStorage.setItem("selectedJobData", JSON.stringify(selectedJob))
      console.log("[v0] Stored job data in localStorage:", selectedJob)
    }
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

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1280px] flex flex-col">
        <header className="fixed top-0 left-0 w-full h-[70px] md:h-[91px] bg-white/90 backdrop-blur-sm z-50">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 md:px-[103px] h-full">
            <img
              className="absolute left-[10px] top-[-8px] w-[160px] h-[105px] object-contain md:w-[296px] md:h-[152px]"
              alt="EL RACE Logo"
              src="/images/design-mode/Logonew.gif"
            />
            <div className="hidden lg:flex items-center gap-[34px] mr-[29px] ml-auto">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="font-medium text-[#656565] text-[18.7px] hover:text-[#151d61] transition-colors"
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
            <div className="lg:hidden fixed top-[70px] left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
              <nav className="max-w-[1280px] mx-auto flex flex-col p-4">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="py-3 px-2 font-medium text-[#656565] text-[16px] md:text-[18px] hover:text-[#151d61]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* Page Header */}
        <section className="relative h-28 md:h-48 w-full mt-[70px] md:mt-[91px]">
          <div className="h-28 md:h-48 bg-[url(/rectangle-1.svg)] bg-cover bg-[50%_50%] absolute w-full">
            <div className="h-28 md:h-48 bg-[linear-gradient(90deg,rgba(0,7,69,0.8)_45%,rgba(84,93,179,0.8)_100%)] absolute w-full">
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
          <div className="w-full max-w-[550px] mx-auto mt-4 md:mt-6 px-2 hidden">
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

          {/* Results count */}
          <div className="px-4 md:px-0 md:ml-[103px] mt-4">
            <p className="[font-family:'Inter',Helvetica] font-normal text-[#4d4d4d] text-[14px] md:text-[16px]">
              {isLoading ? "Loading jobs..." : "Showing 10 jobs"}
            </p>
          </div>

          {/* Job Details Section */}
          <section className="flex flex-col w-full max-w-[1056px] items-start gap-4 md:gap-7 mx-auto mt-6 md:mt-8 px-4 mb-12 md:mb-16">
            {isLoading ? (
              <div className="w-full text-center py-12 md:py-16">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-[#151d61] mb-4" />
                <p className="[font-family:'Inter',Helvetica] font-normal text-[#4d4d4d] text-[14px] md:text-[18px]">
                  Loading job opportunities
                </p>
              </div>
            ) : error ? (
              <div className="w-full text-center py-12 md:py-16">
                <p className="[font-family:'Inter',Helvetica] font-normal text-red-600 text-[14px] md:text-[18px] px-4 mb-4">
                  {error}
                </p>
                <Button onClick={() => window.location.reload()} className="bg-[#151d61] hover:bg-[#0f1547] text-white">
                  Retry
                </Button>
              </div>
            ) : filteredAndSortedJobs.length > 0 ? (
              filteredAndSortedJobs.map((job, index) => (
                <button
                  key={index}
                  onClick={() => handleJobClick(job.id)}
                  className="w-full min-h-[160px] md:h-[220px] bg-white border border-black rounded-lg p-4 md:p-6 text-left hover:bg-gray-200 transition-colors cursor-pointer shadow-sm"
                >
                  <div className="w-full h-full">
                    <div className="w-full [font-family:'Arimo_Hebrew_Subset-Bold',Helvetica]">
                      <div className="mb-2">
                        <h3 className="font-bold text-black text-[18px] md:text-[24.2px] leading-tight">{job.title}</h3>
                      </div>

                      <p className="[font-family:'Tajawal_Medium-Regular',Helvetica] text-[#2d2d2d] text-[12px] md:text-base mb-2 md:mb-3">
                        Location: {job.location} • Posting Date: {job.postingDate}
                      </p>

                      <h4 className="[font-family:'Arimo',Helvetica] font-bold text-black text-[12px] md:text-[15px] mt-2 md:mt-4 mb-1 md:mb-2">
                        About the Job
                      </h4>

                      <p className="[font-family:'Tajawal_Medium-Regular',Helvetica] text-black text-[11px] md:text-[15px] line-clamp-2 leading-relaxed">
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
              © 2025 EL RACE. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
