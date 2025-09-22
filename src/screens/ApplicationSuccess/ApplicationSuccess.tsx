"use client"

import { CheckCircle, XCircle, Menu, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"

export const ApplicationSuccess = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Get screening results from URL parameters
  const qualified = searchParams.get("qualified") === "true"
  const score = Number.parseInt(searchParams.get("score") || "0", 10)
  const percentage = Number.parseInt(searchParams.get("percentage") || "0", 10)
  const applicantId = searchParams.get("applicantId") || ""
  const matchedRequirements = searchParams.get("matched")?.split(",").filter(Boolean) || []
  const missedRequirements = searchParams.get("missed")?.split(",").filter(Boolean) || []

  // Navigation menu items
  const navItems = [
    { name: "SEARCH CAREERS", href: "/search-careers" },
    { name: "CAREERS", href: "/" },
  ]

  useEffect(() => {
    // Clear any remaining localStorage data
    localStorage.removeItem("personalInfo")
    localStorage.removeItem("extendedQuestions")
    localStorage.removeItem("jobTitle")
    localStorage.removeItem("jobName")
  }, [])

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1280px] relative min-h-screen">
        {/* Header/Navigation */}
        <header className="fixed w-full h-[70px] md:h-[91px] top-0 left-0 bg-[#ebebeb] z-50">
          <div className="flex items-center justify-between px-4 md:px-[68px] h-full">
            {/* Logo */}
            <div className="flex items-center">
              <img
                className="w-[140px] h-[65px] md:h-[90px] md:w-[200px] object-contain"
                alt="EL RACE Logo"
                src="https://elrace.com/RCC4/Requirements/IMG/Logonew.gif"
              />
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
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="pt-[90px] md:pt-[120px] px-4 md:px-[60px] pb-[50px] min-h-screen">
          <div className="max-w-4xl mx-auto">
            {/* Success/Result Header */}
            <div className="text-center mb-8">
              {qualified ? (
                <div className="flex flex-col items-center gap-4">
                  <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500" />
                  <h1 className="text-2xl md:text-4xl font-bold text-[#151d61]">Application Submitted Successfully!</h1>
                  <p className="text-lg md:text-xl text-gray-600">
                    Congratulations! Your application has been qualified and submitted to our HR team.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <XCircle className="w-16 h-16 md:w-20 md:h-20 text-orange-500" />
                  <h1 className="text-2xl md:text-4xl font-bold text-[#151d61]">Thank You for Your Interest</h1>
                  <p className="text-lg md:text-xl text-gray-600">
                    We appreciate your application. While your profile shows promise, we are looking for candidates who
                    more closely align with our current requirements.
                  </p>
                </div>
              )}
            </div>

            {/* Screening Results */}
            <Card className="mb-8">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold text-[#151d61] mb-6">Application Screening Results</h2>

                {/* Score Display */}
                <div className="flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div
                      className={`text-4xl md:text-6xl font-bold ${qualified ? "text-green-500" : "text-orange-500"}`}
                    >
                      {percentage}%
                    </div>
                    <p className="text-gray-600 mt-2">Match Score</p>
                  </div>
                </div>

                {/* Requirements Analysis */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Matched Requirements */}
                  {matchedRequirements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Matched Requirements
                      </h3>
                      <ul className="space-y-2">
                        {matchedRequirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Missed Requirements */}
                  {missedRequirements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-2">
                        {missedRequirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Application ID (if qualified) */}
                {qualified && applicantId && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Application ID:</strong> {applicantId}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Please keep this ID for your records. Our HR team will contact you soon.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="mb-8">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold text-[#151d61] mb-4">What's Next?</h2>

                {qualified ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#151d61] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Application Review</h3>
                        <p className="text-gray-600 text-sm">
                          Our HR team will review your qualified application in detail.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#151d61] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Initial Contact</h3>
                        <p className="text-gray-600 text-sm">
                          We will contact you within 3-5 business days if your profile matches our needs.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#151d61] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Interview Process</h3>
                        <p className="text-gray-600 text-sm">
                          If selected, we'll schedule an interview to discuss the opportunity further.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Keep Improving</h3>
                        <p className="text-gray-600 text-sm">
                          Consider gaining experience in the areas mentioned above to strengthen your profile.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Future Opportunities</h3>
                        <p className="text-gray-600 text-sm">
                          We'll keep your application on file for future positions that may be a better match.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Stay Connected</h3>
                        <p className="text-gray-600 text-sm">
                          Follow our career page for new opportunities that match your background.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => router.push("/")}
                className="w-full md:w-auto px-8 py-3 bg-[#151d61] text-white rounded-lg hover:bg-[#1a2470] transition-colors"
              >
                Back to Careers
              </Button>
              <Button
                onClick={() => router.push("/search-careers")}
                variant="outline"
                className="w-full md:w-auto px-8 py-3 border-[#151d61] text-[#151d61] rounded-lg hover:bg-[#151d61] hover:text-white transition-colors"
              >
                Browse Other Jobs
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#151d61] text-white py-8 px-4 md:px-[68px]">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="col-span-1 md:col-span-2">
                <img
                  className="w-[140px] h-[65px] md:w-[200px] md:h-[90px] mb-4 object-contain"
                  alt="EL RACE Logo"
                  src="https://elrace.com/RCC4/Requirements/IMG/Logonew.gif"
                />
                <p className="text-sm text-gray-300 leading-relaxed">
                  Leading construction and contracting company in the UAE, delivering excellence in every project.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/search-careers" className="text-gray-300 hover:text-white transition-colors">
                      Search Jobs
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://ae.indeed.com/cmp/Elrace-Constructions-and-General-Contracting-Co.-LLC/jobs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Indeed Jobs
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>UAE</p>
                  <p>Email: careers@elrace.com</p>
                  <p>Phone: +971 XXX XXXX</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-600 mt-8 pt-8 text-center">
              <p className="text-sm text-gray-300">© 2024 EL RACE Construction. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
