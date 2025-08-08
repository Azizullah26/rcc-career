import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "EL RACE Careers",
  description: "Join our team at EL RACE - A well-established company with over 40 years of experience",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
