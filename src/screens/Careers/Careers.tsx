"use client"

import { ArrowRightIcon, Menu, X } from "lucide-react"
import React, { useEffect, useRef } from "react"
import type { JSX } from "react/jsx-runtime"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"

export const Careers = (): JSX.Element => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked by browser
      })
    }
  }, [])

  const navItems = [
    { name: "HOME", href: "https://elrace.com/" },
    { name: "PROJECTS", href: "https://elrace.com/projects" },
    { name: "SEARCH CAREERS", href: "/search-careers" },
    { name: "CAREERS", href: "/" },
  ]

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <video
        ref={videoRef}
        src="https://elrace.com/RCC4/Requirements/Videos/Banner.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* ✅ ALL CONTENT — ABOVE BACKGROUND */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="relative w-full h-[70px] md:h-[91px] bg-white/90 backdrop-blur-sm">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4 md:px-[103px] h-full">
            <img
              className="absolute left-[10px] top-[-8px] w-[160px] h-[105px] object-contain md:w-[296px] md:h-[152px]"
              alt="EL RACE Logo"
              src="/images/design-mode/Logonew.gif"
            />
            <div className="hidden lg:flex items-center gap-[34px] mr-[29px] ml-auto">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="font-medium text-[#656565] text-[18.7px] hover:text-[#151d61] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <button
              className="lg:hidden p-2 ml-auto"
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

          {isMobileMenuOpen && (
            <div className="lg:hidden fixed top-[70px] left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
              <nav className="max-w-[1280px] mx-auto flex flex-col p-4">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="py-3 px-2 font-medium text-[#656565] text-[16px] md:text-[18px] hover:text-[#151d61]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* Hero */}
        <main className="flex-grow flex flex-col pt-24">
          <section className="h-[300px] md:h-[500px] w-full flex items-center justify-center px-4">
            <div className="text-center max-w-[800px]">
              <h1 className="font-normal text-white text-[24px] md:text-[48px] mb-4 md:mb-6">
                <span className="font-bold tracking-wider">EL RACE CAREERS</span>
              </h1>
              <p className="font-normal text-white text-[12px] md:text-[18px] mb-6 md:mb-8">
                EL RACE is a well-established local company with over 40 years of experience, known for delivering major
                government projects with excellence and reliability. We take pride in our talented and dedicated team,
                and we're always looking for passionate individuals to join our growing family. At EL RACE, you'll find
                a supportive work environment, real opportunities for growth, and a chance to be part of something
                meaningful.
              </p>
              <Button
                onClick={() => router.push("/explore-opportunities")}
                className="bg-[#ce363a] hover:bg-[#b8303a] text-white rounded-lg h-[45px] md:h-[60px] px-6 md:px-12 font-semibold text-[16px] md:text-[20px] flex items-center gap-2 mx-auto"
              >
                Explore Opportunities
                <ArrowRightIcon className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>
          </section>
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
                  <Link
                    href="/"
                    className="text-[11px] md:text-[14px] text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
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
            <p className="text-[10px] md:text-[14px] text-gray-300">© 2024 EL RACE. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <div
        className="absolute inset-0 z-[1] bg-[#8a2923]/92"
        style={{
          clipPath: "polygon(0 0, 56% 0, 0 100%)",
        }}
      />

      <div
        className="absolute inset-0 bg-[length:70%_auto] bg-center z-[3] animate-float"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BannerArt-7BiVtqHdVQetHktkR4UVKLB16X6r32.png')",
          clipPath: "polygon(0 0, 56% 0, 0 100%)",
          opacity: 0.1,
        }}
      />

      <div
        className="absolute inset-0 z-[2] bg-[#0a1142]/75"
        style={{
          clipPath: "polygon(56% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      />
    </div>
  )
}
