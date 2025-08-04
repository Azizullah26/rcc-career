"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "../src/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#ce363a] mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          We're sorry, but something unexpected happened. Please try again or return to the homepage.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            variant="outline"
            className="border-[#151d61] text-[#151d61] hover:bg-[#151d61] hover:text-white px-6 py-3 rounded-lg transition-colors bg-transparent"
          >
            Try again
          </Button>
          <Link href="/">
            <Button className="bg-[#151d61] hover:bg-[#1a2470] text-white px-6 py-3 rounded-lg transition-colors">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
