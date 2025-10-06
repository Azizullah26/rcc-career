"use client"

import { ArrowRightIcon, Menu, X } from "lucide-react"
import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

export const Careers = (): JSX.Element => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Navigation menu items
  const navItems = [
    { name: "SEARCH CAREERS", href: "/search-careers" },
    { name: "CAREERS", href: "/" },
  ]

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1280px] relative min-h-screen">
        {/* Header/Navigation */}
        <header className="w-full h-[70px] md:h-[91px] bg-white relative z-50">
          <div className="flex items-center justify-between px-4 md:px-[103px] h-full">
            {/* Company Logo */}
            <img
              className="w-[140px] h-[75px] md:w-[200px] md:h-[105px]"
              alt="EL RACE Logo"
              src="https://elrace.com/RCC4/Requirements/IMG/Logonew.gif"
            />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between">
              <nav className="flex items-center gap-[34px] mr-[29px]">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="font-medium text-[#656565] text-[18.7px] tracking-[0] leading-[normal] whitespace-nowrap hover:text-[#151d61] transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
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
                    className="py-3 px-2 font-medium text-[#656565] text-[16px] md:text-[18px] transition-colors hover:text-[#151d61]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="relative h-[300px] md:h-[500px] w-full">
          <div className="h-[300px] md:h-[500px] bg-[url(/rectangle-1.svg)] bg-cover bg-[50%_50%] absolute w-full">
            <div className="h-[300px] md:h-[500px] bg-[linear-gradient(90deg,rgba(0,7,69,0.8)_45%,rgba(84,93,179,0.8)_100%)] absolute w-full">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
                <h1 className="font-normal text-white text-[24px] md:text-[48px] tracking-[0] leading-normal mb-4 md:mb-6">
                  <span className="font-bold tracking-wider">EL RACE CAREERS</span>
                </h1>

                <p className="w-full max-w-[800px] mx-auto font-normal text-white text-[12px] md:text-[18px] text-center tracking-[0] leading-relaxed mb-6 md:mb-8">
                  EL RACE is a well-established local company with over 40 years of experience, known for delivering
                  major government projects with excellence and reliability. We take pride in our talented and dedicated
                  team, and we're always looking for passionate individuals to join our growing family. At EL RACE,
                  you'll find a supportive work environment, real opportunities for growth, and a chance to be part of
                  something meaningful.
                </p>

                <Button
                  onClick={() => router.push("/search-careers")}
                  className="bg-[#ce363a] hover:bg-[#b8303a] text-white rounded-lg h-[45px] md:h-[60px] px-6 md:px-12 font-semibold text-[16px] md:text-[20px] transition-colors flex items-center gap-2 mx-auto"
                >
                  Explore Opportunities
                  <ArrowRightIcon className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </div>
            </div>
            <div className="h-[17px] bottom-0 absolute w-full bg-[#9e3442]" />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#151d61] text-white px-4 md:px-[103px] py-6 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
          <div className="border-t border-gray-600 mt-4 md:mt-8 pt-4 md:pt-8 text-center">
            <p className="text-[10px] md:text-[14px] text-gray-300">© 2024 EL RACE. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
