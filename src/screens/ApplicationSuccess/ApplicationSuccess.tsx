"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, FileText, Award } from "lucide-react"

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
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null)
  const [referenceNumber, setReferenceNumber] = useState<string>("")
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
    setLoading(false)
  }, [resultParam, referenceNumberParam])

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
        {referenceNumber && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Your Application Reference Number</p>
                <p className="text-3xl font-bold text-blue-600 tracking-wider mb-2">{referenceNumber}</p>
                <p className="text-xs text-gray-500">
                  Please save this reference number for tracking your application status
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Application Assessment
                </CardTitle>
              </CardHeader>
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Matched Requirements ({screeningResult.matchedRequirements.length})
                  </CardTitle>
                </CardHeader>
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

            {/* Missed Requirements */}
            {screeningResult.missedRequirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <XCircle className="h-5 w-5" />
                    Areas for Development ({screeningResult.missedRequirements.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {screeningResult.missedRequirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <XCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                        <span className="text-sm text-orange-800">{requirement}</span>
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
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <img
                src="/images/design-mode/Logonew.gif"
                alt="RCC Logo"
                className="w-[140px] h-[65px] object-contain mb-4"
              />
              <p className="text-gray-300 text-sm">Building careers in construction and engineering across the UAE.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="text-gray-300 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/explore-opportunities" className="text-gray-300 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="https://ae.indeed.com/cmp/Elrace-Constructions-and-General-Contracting-Co.-LLC/jobs"
                    className="text-gray-300 hover:text-white"
                  >
                    Indeed Jobs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Dubai, UAE</li>
                <li>hr@rcccareer.com</li>
                <li>+971 4 XXX XXXX</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 RCC Career Portal. All rights reserved.</p>
          </div>
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
