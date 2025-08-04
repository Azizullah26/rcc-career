import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "RCC Career Portal - EL RACE Careers",
  description: "Join EL RACE team - Explore career opportunities in construction and infrastructure development",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css?family=Tajawal:400,700" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
