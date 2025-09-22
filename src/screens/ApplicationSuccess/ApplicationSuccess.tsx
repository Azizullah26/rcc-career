"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, ArrowLeft, FileText, Clock, Mail } from "lucide-react"
import Link from "next/link"

// Separate component that uses useSearchParams
function ApplicationSuccessContent() {
  const searchParams = useSearchParams()

  // Get screening results from URL parameters
  const qualified = searchParams.get("qualified") === "true"
  const score = searchParams.get("score") || "0"
  const feedback = searchParams.get("feedback") || ""
  const matchedRequirements = searchParams.get("matched")?.split(",") || []
  const missedRequirements = searchParams.get("missed")?.split(",") || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="https://elrace.com/RCC4/Requirements/IMG/Logonew.gif"
                alt="RCC Logo"
                className="w-[140px] h-[65px] md:w-[200px] md:h-[90px] object-contain"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                {qualified ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-orange-500" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold">
                {qualified ? "Application Submitted Successfully!" : "Application Received"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">Screening Score: {score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        qualified ? "bg-green-500" : "bg-orange-500"
                      }`}
                      style={{ width: `${Math.min(Number(score), 100)}%` }}
                    />
                  </div>
                </div>

                <p className="text-gray-600 text-lg">{feedback}</p>

                {qualified && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">
                        Your application has been forwarded to our HR team
                      </span>
                    </div>
                    <p className="text-green-700 text-sm">
                      We will contact you within 5-7 business days regarding the next steps in the hiring process.
                    </p>
                  </div>
                )}

                {!qualified && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-800">Application Under Review</span>
                    </div>
                    <p className="text-orange-700 text-sm">
                      Your profile will be kept in our database for future opportunities that may be a better match.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Screening Details */}
          {(matchedRequirements.length > 0 || missedRequirements.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Screening Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Matched Requirements */}
                  {matchedRequirements.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Matched Requirements
                      </h3>
                      <ul className="space-y-2">
                        {matchedRequirements.map((requirement, index) => (
                          <li key={index} className="flex items-center text-sm text-green-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Missed Requirements */}
                  {missedRequirements.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-600 mb-3 flex items-center">
                        <XCircle className="h-5 w-5 mr-2" />
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-2">
                        {missedRequirements.map((requirement, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-3" />
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualified ? (
                  <>
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Email Confirmation</h4>
                        <p className="text-sm text-gray-600">
                          You will receive an email confirmation with your application details and reference number.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">HR Review</h4>
                        <p className="text-sm text-gray-600">
                          Our HR team will review your application and contact you within 5-7 business days.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Interview Process</h4>
                        <p className="text-sm text-gray-600">
                          If selected, you will be invited for an interview to discuss your qualifications further.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Profile Stored</h4>
                        <p className="text-sm text-gray-600">
                          Your profile has been added to our talent database for future opportunities.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Future Opportunities</h4>
                        <p className="text-sm text-gray-600">
                          We will contact you if a position becomes available that matches your profile.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Keep Applying</h4>
                        <p className="text-sm text-gray-600">
                          Continue to check our careers page for new positions that may be a better fit.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore-opportunities">
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                <span>View More Jobs</span>
              </Button>
            </Link>
            <Link href="/">
              <Button className="flex items-center space-x-2">
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <img
                src="https://elrace.com/RCC4/Requirements/IMG/Logonew.gif"
                alt="RCC Logo"
                className="w-[140px] h-[65px] md:w-[200px] md:h-[90px] object-contain mb-4"
              />
              <p className="text-gray-300 text-sm">
                Leading construction and contracting company in the UAE, delivering excellence in infrastructure and
                development projects.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/explore-opportunities" className="text-gray-300 hover:text-white text-sm">
                    Careers
                  </Link>
                </li>
                <li>
                  <a
                    href="https://ae.indeed.com/cmp/Elrace-Constructions-and-General-Contracting-Co.-LLC/jobs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white text-sm"
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
                <li>careers@rcc.ae</li>
                <li>+971 4 XXX XXXX</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2024 RCC Construction. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Main component with Suspense boundary - this is the named export
export function ApplicationSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading application results...</p>
          </div>
        </div>
      }
    >
      <ApplicationSuccessContent />
    </Suspense>
  )
}

// Default export for the page
export default ApplicationSuccess
