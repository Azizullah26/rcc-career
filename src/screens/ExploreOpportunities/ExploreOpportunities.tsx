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
  CalendarIcon,
  Upload,
  FileText,
} from "lucide-react"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Separator } from "../../components/ui/separator"
import { Label } from "../../components/ui/label"

// Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Card: React.FC<CardProps> = ({ className = "", children, ...props }) => {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}

// CardContent Component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CardContent: React.FC<CardContentProps> = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

// Textarea Component (inline to avoid import issues)
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: React.FC<TextareaProps> = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${className}`}
      {...props}
    />
  )
}

// Modal Component
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl mx-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  )
}

export const ExploreOpportunities = (): JSX.Element => {
  const router = useRouter()

  // State for filters
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isResumePopupOpen, setIsResumePopupOpen] = useState(false)
  const [resumeForm, setResumeForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    coverLetter: "",
    resume: null as File | null,
  })

  // Navigation menu items
  const navItems = [
    { label: "HOME", href: "https://elrace.com/" },
    { label: "PROJECTS", href: "https://elrace.com/projects" },
    { label: "BLOGS", href: "https://elrace.com/blogs" },
    { label: "CONTACTS", href: "https://elrace.com/contact" },
    { label: "SEARCH CAREERS", href: "/search-careers" },
    { label: "CAREERS", href: "/" },
  ]

  // Job listings data
  const jobListings = [
    {
      id: 1,
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
          job.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
  }, [searchTerm, selectedLocation, sortOrder])

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
  }

  const handleResumeFormChange = (field: string, value: string | File) => {
    setResumeForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleResumeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!resumeForm.fullName || !resumeForm.email || !resumeForm.phone || !resumeForm.resume) {
      alert("Please fill in all required fields and upload your resume.")
      return
    }

    // Here you would typically send the data to your backend
    console.log("Resume submission:", resumeForm)
    
    // Show success message
    alert(`Thank you ${resumeForm.fullName}! Your resume has been submitted successfully. We'll review it and contact you if there's a suitable position.`)
    
    // Reset form and close popup
    setResumeForm({
      fullName: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      coverLetter: "",
      resume: null,
    })
    setIsResumePopupOpen(false)
  }

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1280px] flex flex-col">
        {/* Header/Navigation */}
        <header className="w-full h-[91px] bg-white relative">
          <div className="flex items-center justify-between px-4 md:px-[103px] h-full">
            {/* Company Logo */}
            <img className="w-[120px] h-[54px] md:w-[150px] md:h-[68px]" alt="EL RACE Logo" src="/pre-comp-2-1.svg" />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between">
              <nav className="flex items-center gap-[34px] mr-[29px]">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[14px] sm:text-[16px] md:text-[18.7px] tracking-[0] leading-[normal] whitespace-nowrap hover:text-[#151d61] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-[29px] ml-[60px]">
                <Button
                  onClick={() => window.location.href = 'https://elrace.com/emplogin'}
                  variant="outline"
                  className="flex items-center gap-[5px] w-[80px] sm:w-[90px] md:w-[104px] h-[35px] sm:h-[37px] md:h-[39px] rounded-[9px] border border-solid border-[#151d61] bg-transparent hover:bg-[#151d61] hover:text-white transition-colors"
                >
                  <img className="w-[18px] sm:w-[20px] md:w-[23px] h-[18px] sm:h-[20px] md:h-[23px]" alt="Log in" src="/log-in.svg" />
                  <span className="[font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[#151d61] text-[14px] sm:text-[16px] md:text-[19.7px] tracking-[0] leading-[normal]">
                    Sign in
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-[5px] w-[80px] sm:w-[90px] md:w-[104px] h-[35px] sm:h-[37px] md:h-[39px] rounded-[9px] border border-solid border-[#ce363a] bg-transparent hover:bg-[#ce363a] hover:text-white transition-colors"
                >
                  <img className="w-[16px] sm:w-[18px] md:w-[21.69px] h-[16px] sm:h-[18px] md:h-[21.69px]" alt="Language" src="/language.svg" />
                  <span className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#ce363a] text-[12px] sm:text-[14px] md:text-[18.7px] text-left tracking-[0] leading-[normal] whitespace-nowrap [direction:rtl]">
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
                    className="py-3 px-2 [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[16px] sm:text-[18px] transition-colors hover:text-[#151d61]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => window.location.href = 'https://elrace.com/emplogin'}
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

        {/* Page Header */}
        <section className="relative h-32 md:h-48 w-full">
          <div className="h-32 md:h-48 bg-[url(/rectangle-1.svg)] bg-cover bg-[50%_50%] absolute w-full">
            <div className="h-32 md:h-48 bg-[linear-gradient(90deg,rgba(0,7,69,0.8)_45%,rgba(84,93,179,0.8)_100%)] absolute w-full">
              <div className="absolute top-4 md:top-6 left-4 md:left-[103px]">
                <Link
                  href="/search-careers"
                  className="flex items-center gap-2 md:gap-3 text-white hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="[font-family:'Tajawal',Helvetica] font-normal text-[14px] sm:text-[16px] md:text-[18px]">
                    Back to Search
                  </span>
                </Link>
              </div>

              <h1 className="absolute top-[50px] md:top-[60px] left-1/2 transform -translate-x-1/2 [font-family:'Times_New_Roman-Regular',Helvetica] font-normal text-white text-[20px] sm:text-[28px] md:text-[36px] tracking-[0] leading-normal text-center px-4">
                EXPLORE OPPORTUNITIES
              </h1>

              <p className="absolute w-[90%] md:w-[800px] top-[80px] md:top-[110px] left-1/2 transform -translate-x-1/2 [font-family:'Tajawal',Helvetica] font-normal text-white text-[10px] sm:text-[12px] md:text-[16px] text-center tracking-[0] leading-normal px-4">
                Join our team of dedicated professionals and be part of UAE's leading construction company
              </p>
            </div>
            <div className="h-[17px] bottom-0 absolute w-full bg-[#9e3442]" />
          </div>
        </section>

        {/* Main content area */}
        <main className="w-full flex flex-col">
          {/* Search Filter Section */}
          <div className="w-full max-w-[819px] mx-auto mt-6 md:mt-8 px-4">
            <Card className="rounded-[9px] border-2 border-[#6b6b6b] overflow-hidden">
              {/* Mobile Layout */}
              <div className="md:hidden">
                <div className="flex flex-col">
                  <div className="flex flex-col px-[20px] py-[20px]">
                    <div className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#6b6b6b] text-[14px] sm:text-[16px] tracking-[0]">
                      FIND JOBS
                    </div>
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mt-2 border-none p-0 h-auto shadow-none [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-black text-[16px] sm:text-[20px] tracking-[0] placeholder:text-black focus-visible:ring-0"
                      placeholder="Job title, skill, keyword"
                    />
                  </div>
                  <Separator orientation="horizontal" className="h-[1px]" />
                  <div className="flex flex-col px-[20px] py-[20px]">
                    <div className="flex items-center justify-between">
                      <div className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#6b6b6b] text-[14px] sm:text-[16px] tracking-[0]">
                        NEAR LOCATIONS
                      </div>
                      <ChevronDownIcon className="w-[12.99px] h-[11.25px] text-[#6b6b6b]" />
                    </div>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="mt-2 border-none p-0 h-auto shadow-none [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-black text-[16px] sm:text-[20px] tracking-[0] focus-visible:ring-0 bg-transparent">
                        <SelectValue placeholder="City" />
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
                    className="w-full h-[50px] sm:h-[60px] rounded-none bg-[#e6e6e6] hover:bg-[#d9d9d9] border-t-2 border-[#6b6b6b]"
                    variant="ghost"
                  >
                    <SearchIcon className="w-[28px] sm:w-[32px] h-[28px] sm:h-[32px] text-black" />
                  </Button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex h-[138px]">
                <div className="flex-1 flex flex-col justify-center px-[35px]">
                  <div className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#6b6b6b] text-[18px] md:text-[20.1px] tracking-[0]">
                    FIND JOBS
                  </div>
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-2 border-none p-0 h-auto shadow-none [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-black text-[22px] md:text-[25.9px] tracking-[0] placeholder:text-black focus-visible:ring-0"
                    placeholder="Job title, skill, keyword"
                  />
                </div>
                <Separator orientation="vertical" className="h-[62px] my-auto" />
                <div className="flex-1 flex flex-col justify-center px-[35px]">
                  <div className="flex items-center justify-between">
                    <div className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#6b6b6b] text-[18px] md:text-[20.1px] tracking-[0]">
                      NEAR LOCATIONS
                    </div>
                    <ChevronDownIcon className="w-[12.99px] h-[11.25px] text-[#6b6b6b]" />
                  </div>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="mt-2 border-none p-0 h-auto shadow-none [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-black text-[22px] md:text-[25.9px] tracking-[0] focus-visible:ring-0 bg-transparent">
                      <SelectValue placeholder="City" />
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
                  className="w-[156px] h-full rounded-none rounded-r-[9px] bg-[#e6e6e6] hover:bg-[#d9d9d9] border-l-2 border-[#6b6b6b]"
                  variant="ghost"
                >
                  <SearchIcon className="w-[34px] md:w-[38px] h-[34px] md:h-[38px] text-black" />
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
              <div className="[font-family:'Inter',Helvetica] font-normal text-[#4d4d4d] text-[12px] sm:text-[14px] md:text-[17.8px]">
                Posting Date {sortOrder === "desc" ? "(Newest First)" : "(Oldest First)"}
              </div>
              {sortOrder === "desc" ? (
                <ArrowDownIcon className="w-[10.93px] h-[18.55px] text-[#4d4d4d]" />
              ) : (
                <ArrowUpIcon className="w-[10.93px] h-[18.55px] text-[#4d4d4d]" />
              )}
            </button>

            <div className="h-[35px] sm:h-[40px] md:h-[40.07px] rounded-[8.91px] border-[1.48px] border-solid border-[#a4a4a4] flex">
              <button
                onClick={() => setViewMode("list")}
                className={`w-[55px] sm:w-[60px] md:w-[67px] h-8 sm:h-9 md:h-10 rounded-[8.91px_0px_0px_8.91px] flex items-center justify-center transition-colors ${
                  viewMode === "list" ? "bg-[#a4a4a4]" : "bg-transparent hover:bg-gray-100"
                }`}
              >
                <ListIcon className="w-[16px] sm:w-[18px] md:w-[21px] h-[16px] sm:h-[18px] md:h-[21px]" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`w-[55px] sm:w-[60px] md:w-[67px] h-8 sm:h-9 md:h-10 flex items-center justify-center transition-colors ${
                  viewMode === "map" ? "bg-[#a4a4a4]" : "bg-transparent hover:bg-gray-100"
                }`}
              >
                <MapPinIcon className="w-[16px] sm:w-[18px] md:w-[21px] h-[16px] sm:h-[18px] md:h-[21px]" />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="px-4 md:px-0 md:ml-[103px] mt-4">
            <p className="[font-family:'Inter',Helvetica] font-normal text-[#4d4d4d] text-[12px] sm:text-[14px] md:text-[16px]">
              Showing {filteredAndSortedJobs.length} of {jobListings.length} jobs
            </p>
          </div>

          {/* Job Details Section */}
          <section className="flex flex-col w-full max-w-[1056px] items-start gap-4 md:gap-7 mx-auto mt-6 md:mt-8 px-4 md:px-[103px]">
            {filteredAndSortedJobs.length > 0 ? (
              filteredAndSortedJobs.map((job, index) => (
                <button
                  key={index}
                  onClick={() => handleJobClick(job.id)}
                  className="w-full min-h-[160px] sm:min-h-[180px] md:h-[220px] bg-[#cfcfcf] border-none rounded-lg p-4 md:p-6 text-left hover:bg-[#c5c5c5] transition-colors cursor-pointer"
                >
                  <div className="w-full h-full">
                    <div className="w-full [font-family:'Arimo_Hebrew_Subset-Bold',Helvetica]">
                      <h3 className="font-bold text-black text-[16px] sm:text-[20px] md:text-[24.2px] mb-2">{job.title}</h3>

                      <p className="[font-family:'Tajawal_Medium-Regular',Helvetica] text-[#2d2d2d] text-[12px] sm:text-[14px] md:text-base mb-3 flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#2d2d2d]" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#2d2d2d]" />
                          {job.postingDate}
                        </span>
                      </p>

                      <h4 className="[font-family:'Arimo',Helvetica] font-bold text-black text-[11px] sm:text-[13px] md:text-[15px] mt-3 md:mt-4 mb-2">
                        ABOUT THE JOB
                      </h4>

                      <p className="[font-family:'Tajawal_Medium-Regular',Helvetica] text-black text-[11px] sm:text-[13px] md:text-[15px] line-clamp-3 md:line-clamp-none">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="w-full text-center py-12 md:py-16">
                <p className="[font-family:'Inter',Helvetica] font-normal text-[#4d4d4d] text-[14px] sm:text-[16px] md:text-[18px]">
                  No jobs found matching your criteria. Try adjusting your search filters.
                </p>
              </div>
            )}
          </section>
        </main>

        {/* Call to Action Section */}
        <section className="bg-gray-50 px-4 md:px-[103px] py-12 md:py-16">
          <div className="text-center">
            <h2 className="[font-family:'Times_New_Roman-Regular',Helvetica] font-normal text-[#151d61] text-[20px] sm:text-[24px] md:text-[32px] mb-4">
              Don't See the Right Position?
            </h2>
            <p className="[font-family:'Tajawal',Helvetica] text-[#656565] text-[12px] sm:text-[14px] md:text-[18px] mb-6 md:mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in
              mind for future opportunities.
            </p>
            
            <Button 
              onClick={() => setIsResumePopupOpen(true)}
              className="bg-[#ce363a] hover:bg-[#b8303a] text-white rounded-lg h-[40px] sm:h-[45px] md:h-[50px] px-6 md:px-8 [font-family:'Tajawal',Helvetica] font-semibold text-[14px] sm:text-[16px] md:text-[18px] transition-colors"
            >
              Submit Your Resume
            </Button>
            
            <Modal isOpen={isResumePopupOpen} onClose={() => setIsResumePopupOpen(false)}>
              <div className="p-6 md:p-8">
                <h2 className="text-[#151d61] text-[18px] sm:text-[20px] md:text-[24px] font-bold text-center mb-6">
                  Submit Your Resume
                </h2>
                
                <form onSubmit={handleResumeSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-[14px] sm:text-[16px] font-semibold text-black">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={resumeForm.fullName}
                        onChange={(e) => handleResumeFormChange("fullName", e.target.value)}
                        className="h-10 md:h-12 rounded-lg border-2 border-gray-300 focus:border-[#151d61]"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[14px] sm:text-[16px] font-semibold text-black">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeForm.email}
                        onChange={(e) => handleResumeFormChange("email", e.target.value)}
                        className="h-10 md:h-12 rounded-lg border-2 border-gray-300 focus:border-[#151d61]"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[14px] sm:text-[16px] font-semibold text-black">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={resumeForm.phone}
                        onChange={(e) => handleResumeFormChange("phone", e.target.value)}
                        className="h-10 md:h-12 rounded-lg border-2 border-gray-300 focus:border-[#151d61]"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-[14px] sm:text-[16px] font-semibold text-black">
                        Desired Position
                      </Label>
                      <Input
                        id="position"
                        type="text"
                        value={resumeForm.position}
                        onChange={(e) => handleResumeFormChange("position", e.target.value)}
                        className="h-10 md:h-12 rounded-lg border-2 border-gray-300 focus:border-[#151d61]"
                        placeholder="e.g., Civil Engineer, Project Manager"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-[14px] sm:text-[16px] font-semibold text-black">
                      Years of Experience
                    </Label>
                    <Select onValueChange={(value) => handleResumeFormChange("experience", value)}>
                      <SelectTrigger className="h-10 md:h-12 rounded-lg border-2 border-gray-300 focus:border-[#151d61]">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="2-3">2-3 years</SelectItem>
                        <SelectItem value="4-5">4-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coverLetter" className="text-[14px] sm:text-[16px] font-semibold text-black">
                      Cover Letter / Message
                    </Label>
                    <Textarea
                      id="coverLetter"
                      value={resumeForm.coverLetter}
                      onChange={(e) => handleResumeFormChange("coverLetter", e.target.value)}
                      className="min-h-[80px] sm:min-h-[100px] rounded-lg border-2 border-gray-300 focus:border-[#151d61] resize-none"
                      placeholder="Tell us why you'd be a great fit for EL RACE..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="resume" className="text-[14px] sm:text-[16px] font-semibold text-black">
                      Upload Resume *
                    </Label>
                    <div className="relative">
                      <input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleResumeFormChange("resume", file)
                          }
                        }}
                        className="hidden"
                        required
                      />
                      <Button
                        type="button"
                        onClick={() => document.getElementById("resume")?.click()}
                        variant="outline"
                        className="w-full h-10 md:h-12 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#151d61] flex items-center justify-center gap-2"
                      >
                        {resumeForm.resume ? (
                          <>
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#151d61]" />
                            <span className="text-[#151d61] text-[12px] sm:text-[14px]">{resumeForm.resume.name}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                            <span className="text-gray-500 text-[10px] sm:text-[12px] md:text-base">Click to upload your resume (PDF, DOC, DOCX)</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsResumePopupOpen(false)}
                      className="flex-1 h-10 md:h-12 rounded-lg border-2 border-gray-300 hover:bg-gray-50 text-[14px] sm:text-[16px]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-10 md:h-12 rounded-lg bg-[#151d61] hover:bg-[#1a2470] text-white font-semibold text-[14px] sm:text-[16px]"
                    >
                      Submit Resume
                    </Button>
                  </div>
                </form>
              </div>
            </Modal>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#151d61] text-white px-4 md:px-[103px] py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <img
                className="w-[80px] h-[36px] sm:w-[100px] sm:h-[45px] md:w-[120px] md:h-[54px] mb-4 brightness-0 invert"
                alt="EL RACE Logo"
                src="/pre-comp-2-1.svg"
              />
              <p className="[font-family:'Tajawal',Helvetica] text-[10px] sm:text-[12px] md:text-[14px] text-gray-300 leading-relaxed">
                Building UAE's future with over 40 years of excellence in construction and infrastructure development.
              </p>
            </div>
            <div>
              <h3 className="[font-family:'Tajawal',Helvetica] font-semibold text-[14px] sm:text-[16px] md:text-[18px] mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://elrace.com/"
                    className="[font-family:'Tajawal',Helvetica] text-[10px] sm:text-[12px] md:text-[14px] text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="https://elrace.com/projects"
                    className="[font-family:'Tajawal',Helvetica] text-[10px] sm:text-[12px] md:text-[14px] text-gray-300 hover:text-white transition-colors"
                  >
                    Projects
                  </a>
                </li>
                <li>
                  <a
                    href="https://elrace.com/about"
                    className="[font-family:'Tajawal',Helvetica] text-[10px] sm:text-[12px] md:text-[14px] text-gray-300 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://elrace.com/contact"
                    className="[font-family:'Tajawal',Helvetica] text-[10px] sm:text-[12px] md:text-[14px] text-gray-300 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="[font-family:'Tajawal',Helvetica] font-semibold text-[14px] sm:text-[16px] md:text-[18px] mb-4">
                Contact Info
              </h3>
              <div className="space-y-2 text-[10px] sm:text-[12px] md:text-[14px] text-gray-300">
                <p className="[font-family:'Tajawal',Helvetica]">EL RACE UAE</p>
                <p className="[font-family:'Tajawal',Helvetica]">+971 2 1234 5678</p>
                <p className="[font-family:'Tajawal',Helvetica]">careers@elrace.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
            <p className="[font-family:'Tajawal',Helvetica] text-[10px] sm:text-[12px] md:text-[14px] text-gray-300">
              © 2024 EL RACE. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}