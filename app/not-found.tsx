import Link from "next/link"
import { Button } from "../src/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#151d61] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for. Please check the URL or return to the homepage.
        </p>
        <Link href="/">
          <Button className="bg-[#151d61] hover:bg-[#1a2470] text-white px-6 py-3 rounded-lg transition-colors">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
