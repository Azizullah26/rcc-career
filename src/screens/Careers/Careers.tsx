"use client"

import React from "react"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Menu, X } from "lucide-react"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

export const Careers = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Navigation menu items
  const navItems = [
    { label: "HOME", href: "#" },
    { label: "PROJECTS", href: "#" },
    { label: "BLOGS", href: "#" },
    { label: "CONTACTS", href: "#" },
    { label: "CAREERS", href: "#", active: true },
  ]

  return (
    <div className="bg-white flex-row justify-center w-full flex">
      <div className="bg-white w-full max-w-[1280px] relative">
        {/* Header/Navigation */}
        <header className="h-[70px] md:h-[91px] w-full bg-white flex items-center justify-between px-4 md:px-[103px] relative z-50">
          <img className="w-[100px] h-[45px] md:w-[150px] md:h-[68px]" alt="EL RACE Logo" src="/pre-comp-2-1.svg" />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between gap-10">
            <nav className="flex items-center gap-[34px]">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[18.7px] tracking-[0] leading-normal whitespace-nowrap transition-colors ${
                    item.active ? "text-[#151d61]" : "text-[#656565] hover:text-[#151d61]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-[29px]">
              <Button
                variant="outline"
                className="flex items-center gap-[5px] h-[39px] w-[104px] rounded-[9px] border border-solid border-[#151d61] bg-transparent hover:bg-[#151d61] hover:text-white transition-colors"
              >
                <img className="w-[23px] h-[23px]" alt="Log in" src="/log-in.svg" />
                <span className="[font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[#151d61] text-[19.7px] hover:text-white transition-colors">
                  Sign in
                </span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-[5px] h-[39px] w-[104px] rounded-[9px] border border-solid border-[#ce363a] bg-transparent hover:bg-[#ce363a] hover:text-white transition-colors"
              >
                <img className="w-[21.69px] h-[21.69px]" alt="Language" src="/language.svg" />
                <span className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#ce363a] text-[18.7px] text-left tracking-[0] leading-normal whitespace-nowrap [direction:rtl] hover:text-white transition-colors">
                  العربيــة
                </span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 z-50 relative" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-[#151d61]" /> : <Menu className="w-6 h-6 text-[#151d61]" />}
          </button>
        </header>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed top-[70px] md:top-[91px] left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
            <nav className="flex flex-col p-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`py-3 px-2 [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[16px] md:text-[18px] transition-colors ${
                    item.active ? "text-[#151d61]" : "text-[#656565] hover:text-[#151d61]"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-[45px] rounded-[9px] border border-solid border-[#151d61] bg-transparent hover:bg-[#151d61] hover:text-white transition-colors"
                >
                  <img className="w-[20px] h-[20px]" alt="Log in" src="/log-in.svg" />
                  <span className="[font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[#151d61] text-[16px]">
                    Sign in
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-[45px] rounded-[9px] border border-solid border-[#ce363a] bg-transparent hover:bg-[#ce363a] hover:text-white transition-colors"
                >
                  <img className="w-[18px] h-[18px]" alt="Language" src="/language.svg" />
                  <span className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#ce363a] text-[16px] [direction:rtl]">
                    العربيــة
                  </span>
                </Button>
              </div>
            </nav>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative h-48 md:h-60 w-full mt-[70px] md:mt-[91px]">
          <div className="h-48 md:h-60 bg-[url(/rectangle-1.svg)] bg-cover bg-[50%_50%] absolute w-full">
            <div className="h-auto min-h-48 md:h-60 bg-[linear-gradient(90deg,rgba(0,7,69,0.8)_45%,rgba(84,93,179,0.8)_100%)] absolute w-full pb-4 md:pb-0">
              <h1 className="absolute top-6 md:top-[26px] left-1/2 transform -translate-x-1/2 [font-family:'Times_New_Roman-Regular',Helvetica] font-normal text-white text-[24px] md:text-[42.9px] tracking-[0] leading-normal text-center px-4">
                <span className="text-[16px] md:text-[48.1px] font-bold tracking-wider whitespace-nowrap">EL RACE CAREERS</span>
              </h1>

              <p className="absolute w-[90%] md:w-[1056px] top-[60px] md:top-[102px] left-1/2 transform -translate-x-1/2 [font-family:'Tajawal',Helvetica] font-normal text-white text-[11px] md:text-[19.7px] text-justify tracking-[0] leading-relaxed px-4 max-h-none">
                EL RACE&nbsp;&nbsp;is a well-established local company with over 40 years of experience, known for
                delivering major government projects with excellence and reliability. We take pride in our talented and
                dedicated team, and we&apos;re always looking for passionate individuals to join our growing family. At
                EL RACE , you&#39;ll find a supportive work environment, real opportunities for growth, and a chance to
                be part of something meaningful.
              </p>
            </div>
            <div className="h-[17px] bottom-0 absolute w-full bg-[#9e3442]" />
          </div>
        </section>

        {/* Call to Action Button */}
        <div className="flex justify-center mt-[60px] md:mt-[90px] px-4">
          <Link href="/search-careers">
            <Button className="w-[220px] md:w-[286px] h-[45px] md:h-[54px] bg-[#151d61] rounded-[11px] [font-family:'Tajawal',Helvetica] font-bold text-white text-[18px] md:text-[25.1px] text-center tracking-[0] leading-normal hover:bg-[#1a2470] transition-colors">
              Explore Opportunities
            </Button>
          </Link>
        </div>

        {/* Bottom Image */}
        <img
          className="w-full h-[250px] md:h-[539px] mt-[40px] md:mt-[87px] object-cover"
          alt="Construction site"
          src="/image-2.png"
        />
      </div>
    </div>
  )
}