"use client"

import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-red-600 mb-4">Error</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Something went wrong!</h2>
            <p className="text-gray-600 mb-8 max-w-md">
              A global error occurred. Please try refreshing the page or return to the homepage.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
                className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg transition-colors"
              >
                Try again
              </button>
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-block"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
