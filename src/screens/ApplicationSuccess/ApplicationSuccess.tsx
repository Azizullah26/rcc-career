"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, FileText, Award } from "lucide-react"

interface ScreeningResult {
  score: number
  maxScore: number
  percentage: number
  qualified: boolean
  matchedRequirements: string[]
  missedRequirements: string[]
  feedback: string
}

function ApplicationSuccessContent() {
  const searchParams = useSearchParams()
  const resultParam = searchParams.get("result")
  const referenceNumberParam = searchParams.get("referenceNumber") // Get reference number from URL
  const jobReferenceNumberParam = searchParams.get("jobReferenceNumber") // Job reference number
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null)
  const [referenceNumber, setReferenceNumber] = useState<string>("")
  const [jobReferenceNumber, setJobReferenceNumber] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (resultParam) {
      try {
        const result = JSON.parse(decodeURIComponent(resultParam))
        setScreeningResult(result)
      } catch (error) {
        console.error("Error parsing screening result:", error)
      }
    }
    if (referenceNumberParam) {
      setReferenceNumber(referenceNumberParam)
    }
    if (jobReferenceNumberParam) {
      setJobReferenceNumber(jobReferenceNumberParam)
    }
    setLoading(false)
  }, [resultParam, referenceNumberParam, jobReferenceNumberParam])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading your application results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/images/design-mode/Logonew.gif" alt="RCC Logo" className="w-[200px] h-[90px] object-contain" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {jobReferenceNumber && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Job Reference Number</p>
                <p className="text-3xl font-bold text-blue-600 tracking-wider mb-2">{jobReferenceNumber}</p>
                <p className="text-xs text-gray-500">
                  This is the reference number for the job position you applied for
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center mb-8">
          {screeningResult?.qualified ? (
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          ) : (
            <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted Successfully</h1>

          <p className="text-lg text-gray-600">Thank you for your interest in joining our team at RCC Career Portal</p>
        </div>

        {/* Screening Results */}
        {screeningResult && (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card>
              <div className="p-6 pb-0">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Application Assessment
                </CardTitle>
              </div>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold mb-2">{screeningResult.percentage}%</div>
                  <div className="text-sm text-gray-600">
                    Score: {screeningResult.score} / {screeningResult.maxScore}
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        screeningResult.qualified
                          ? "bg-green-600"
                          : screeningResult.percentage >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(screeningResult.percentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    screeningResult.qualified
                      ? "bg-green-50 border border-green-200"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{screeningResult.feedback}</p>
                </div>
              </CardContent>
            </Card>

            {/* Matched Requirements */}
            {screeningResult.matchedRequirements.length > 0 && (
              <Card>
                <div className="p-6 pb-0">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Matched Requirements ({screeningResult.matchedRequirements.length})
                  </CardTitle>
                </div>
                <CardContent>
                  <div className="grid gap-2">
                    {screeningResult.matchedRequirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-green-800">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Next Steps */}
        <Card className="mt-8">
          <div className="p-6">
            <CardTitle>What Happens Next?</CardTitle>
          </div>
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Application Review</h4>
                <p className="text-sm text-gray-600">
                  Our HR team will review your application and supporting documents.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Initial Screening</h4>
                <p className="text-sm text-gray-600">
                  Qualified candidates will be contacted for an initial phone screening.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Interview Process</h4>
                <p className="text-sm text-gray-600">
                  Successful candidates will be invited for technical and HR interviews.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Final Decision</h4>
                <p className="text-sm text-gray-600">We will notify you of our decision within 5-7 business days.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button onClick={() => (window.location.href = "/")} className="bg-blue-600 hover:bg-blue-700">
            Return to Home
          </Button>

          <Button variant="outline" onClick={() => (window.location.href = "/explore-opportunities")}>
            View Other Opportunities
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#151d61] text-white px-4 md:px-[103px] py-6 md:py-12 mt-auto">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <img
              className="w-[80px] h-[36px] md:w-[120px] md:h-[54px] mb-3 md:mb-4 brightness-0 invert"
              alt="EL RACE Logo"
              src="/pre-comp-2-1.svg"
            />
            <p className="text-[11px] md:text-[14px] text-gray-300 leading-relaxed">
              Building UAE's future with over 40 years of excellence in construction and infrastructure development.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[14px] md:text-[18px] mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <a href="/" className="text-[11px] md:text-[14px] text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="https://ae.indeed.com/cmp/Elrace-Constructions-and-General-Contracting-Co.-LLC/jobs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] md:text-[14px] text-gray-300 hover:text-white transition-colors"
                >
                  Indeed Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-[11px] md:text-[14px] text-gray-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-[11px] md:text-[14px] text-gray-300 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[14px] md:text-[18px] mb-3 md:mb-4">Contact Info</h3>
            <div className="space-y-1 md:space-y-2 text-[11px] md:text-[14px] text-gray-300">
              <p>EL RACE UAE</p>
              <p>600500722</p>
              <p>info@elrace.com</p>
            </div>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto border-t border-gray-600 mt-4 md:mt-8 pt-4 md:pt-8 text-center">
          <p className="text-[10px] md:text-[14px] text-gray-300">© 2025 EL RACE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export function ApplicationSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ApplicationSuccessContent />
    </Suspense>
  )
}

export default ApplicationSuccess
