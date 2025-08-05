"use client"

import { SearchIcon, Menu, X } from "lucide-react"
import React from "react"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Separator } from "../../components/ui/separator"
import { Card } from "./Card" // Import Card component

// Main Component
export const SearchCareers = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Navigation menu items
  const navItems = [
    { label: "HOME", href: "/" },
    { label: "PROJECTS", href: "#" },
    { label: "BLOGS", href: "#" },
    { label: "CONTACTS", href: "#" },
    { label: "SEARCH CAREERS", href: "/search-careers", active: true },
    { label: "CAREERS", href: "/" },
  ]

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1280px] relative">
        {/* Header/Navigation */}
        <header className="w-full h-[70px] md:h-[91px] bg-white relative z-50">
          <div className="flex items-center justify-between px-4 md:px-[103px] h-full">
            {/* Company Logo */}
            <img className="w-[100px] h-[45px] md:w-[150px] md:h-[68px]" alt="EL RACE Logo" src="/pre-comp-2-1.svg" />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between">
              <nav className="flex items-center gap-[34px] mr-[29px]">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[18.7px] tracking-[0] leading-[normal] whitespace-nowrap ${
                      item.active ? "text-[#151d61]" : "text-[#656565] hover:text-[#151d61]"
                    } transition-colors`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-[29px] ml-[60px]">
                <Button
                  variant="outline"
                  className="flex items-center gap-[5px] w-[104px] h-[39px] rounded-[9px] border border-solid border-[#151d61] bg-transparent hover:bg-[#151d61] hover:text-white transition-colors"
                >
                  <img className="w-[23px] h-[23px]" alt="Log in" src="/log-in.svg" />
                  <span className="[font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[#151d61] text-[19.7px] tracking-[0] leading-[normal]">
                    Sign in
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-[5px] w-[104px] h-[39px] rounded-[9px] border border-solid border-[#ce363a] bg-transparent hover:bg-[#ce363a] hover:text-white transition-colors"
                >
                  <img className="w-[21.69px] h-[21.69px]" alt="Language" src="/language.svg" />
                  <span className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#ce363a] text-[18.7px] text-left tracking-[0] leading-[normal] whitespace-nowrap [direction:rtl]">
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
        </header>

        {/* Main Content */}
        <main className="w-full max-w-[1052px] mx-auto mt-[90px] md:mt-[115px] px-4">
          {/* Banner Image Section */}
          <section className="flex flex-col w-full items-center gap-[13.66px] mb-[40px] md:mb-[60px]">
            <div className="relative w-full h-[200px] md:h-[326.26px] bg-[url(/image.png)] bg-cover bg-center rounded-lg overflow-hidden">
              <div className="h-full bg-[linear-gradient(90deg,rgba(0,7,69,0.8)_45%,rgba(84,93,179,0.8)_100%)] flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="[font-family:'Times_New_Roman-Regular',Helvetica] font-normal text-[18px] md:text-[42px] mb-2 md:mb-4">
                    <span className="font-bold tracking-wider whitespace-nowrap">SEARCH CAREERS</span>
                  </h1>
                  <p className="[font-family:'Tajawal',Helvetica] font-normal text-[10px] md:text-[18px] max-w-2xl">
                    Find your perfect career opportunity with EL RACE
                  </p>
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="inline-flex items-center gap-[8.84px]">
              <div className="bg-[#6b6b6b] w-[13.66px] h-[13.66px] rounded-[6.83px]" />
              <div className="border-[0.62px] border-solid border-[#6b6b6b] w-[13.66px] h-[13.66px] rounded-[6.83px]" />
            </div>
          </section>

          {/* Company Description */}
          <section className="w-full text-justify [font-family:'Tajawal',Helvetica] font-normal text-[#494949] text-[16px] md:text-[21.3px] tracking-[0] leading-[normal] mb-[40px] md:mb-[60px]">
            <p>
              Since 1985, EL RACE Contracting has been on a continuous journey of success and achievement, built on a
              steadfast commitment to hard work and pure intentions.
            </p>
            <br />
            <p>
              Over the past four decades, much has changed. Our tools have evolved, our cities have expanded, and our
              ambitions have grown. But what has never changed is our unwavering belief in our core values:
              professionalism, integrity, transparency, and sustainability.
            </p>
            <br />
            <p>
              We believe that true success is only achieved through a motivating work environment, where every
              individual finds their place to contribute to building projects that serve communities and create a better
              future for our nation.
              <br />
              <strong>We're Looking for You!</strong>
            </p>
            <br />
            <p>
              If you have a passion for excellence, the ambition to face challenges, and you share our values of
              innovation and social responsibility, we invite you to be a part of our team.
              <br />
              Join us today, and add your mark to a continuous story of success.
            </p>
          </section>

          {/* Job Search Section */}
          <Card className="w-full max-w-[813px] mx-auto rounded-[9px] border-2 border-solid border-[#6b6b6b] overflow-hidden shadow-lg">
            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="flex flex-col">
                <div className="flex flex-col px-4 py-4">
                  <span className="[font-family:'Tajawal',Helvetica] font-normal text-[#6b6b6b] text-[16px] text-center">
                    FIND JOBS
                  </span>
                  <span className="[font-family:'Tajawal',Helvetica] font-normal text-black text-[18px] text-center mt-2">
                    Job title
                  </span>
                </div>
                <Separator orientation="horizontal" className="h-0.5 bg-[#6b6b6b]" />
                <div className="flex flex-col px-4 py-4">
                  <div className="flex items-center justify-between">
                    <span className="[font-family:'Tajawal',Helvetica] font-normal text-[#6b6b6b] text-[16px] text-center">
                      NEAR LOCATIONS
                    </span>
                    <svg className="w-[12.99px] h-[11.25px]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </div>
                  <span className="[font-family:'Tajawal',Helvetica] font-normal text-black text-[18px] text-center mt-2">
                    City
                  </span>
                </div>
                <Link href="/explore-opportunities" className="w-full">
                  <Button className="w-full h-[50px] rounded-none bg-[#e6e6e6] border-t-2 border-solid border-[#6b6b6b] flex items-center justify-center hover:bg-[#d6d6d6] transition-colors">
                    <SearchIcon className="w-[28px] h-[28px] text-black" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex h-[138px]">
              <div className="flex-1 flex items-center">
                <div className="flex flex-col px-[35px] py-[35px] flex-1">
                  <span className="[font-family:'Tajawal',Helvetica] font-normal text-[#6b6b6b] text-[20.1px] text-center">
                    FIND JOBS
                  </span>
                  <span className="[font-family:'Tajawal',Helvetica] font-normal text-black text-[25.9px] text-center mt-[12px]">
                    Job title
                  </span>
                </div>
                <Separator orientation="vertical" className="h-[62px] w-0.5 bg-[#6b6b6b]" />
                <div className="flex flex-col px-[35px] py-[35px] flex-1">
                  <div className="flex items-center justify-between">
                    <span className="[font-family:'Tajawal',Helvetica] font-normal text-[#6b6b6b] text-[20.1px] text-center">
                      NEAR LOCATIONS
                    </span>
                    <svg className="w-[12.99px] h-[11.25px]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </div>
                  <span className="[font-family:'Tajawal',Helvetica] font-normal text-black text-[25.9px] text-center mt-[15px]">
                    City
                  </span>
                </div>
              </div>

              <Link href="/explore-opportunities" className="w-[156px] h-full">
                <Button className="w-full h-full rounded-[0px_9px_9px_0px] bg-[#e6e6e6] border-l-2 border-solid border-[#6b6b6b] flex items-center justify-center hover:bg-[#d6d6d6] transition-colors">
                  <SearchIcon className="w-[38px] h-[38px] text-black" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Navigation to Explore Opportunities */}
          <div className="flex justify-center mt-8 md:mt-[60px] mb-8 md:mb-[60px] px-4">
            <Link href="/explore-opportunities">
              <Button className="bg-[#151d61] hover:bg-[#1a2470] text-white rounded-lg h-[45px] md:h-[50px] px-6 md:px-8 [font-family:'Tajawal',Helvetica] font-semibold text-[16px] md:text-[18px] transition-colors w-full sm:w-auto">
                View All Opportunities
              </Button>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#151d61] text-white px-4 md:px-[103px] py-6 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <img
                className="w-[80px] h-[36px] md:w-[120px] md:h-[54px] mb-3 md:mb-4 brightness-0 invert"
                alt="EL RACE Logo"
                src="/pre-comp-2-1.svg"
              />
              <p className="[font-family:'Tajawal',Helvetica] text-[11px] md:text-[14px] text-gray-300 leading-relaxed">
                Building UAE's future with over 40 years of excellence in construction and infrastructure development.
              </p>
            </div>
            <div>
              <h3 className="[font-family:'Tajawal',Helvetica] font-semibold text-[14px] md:text-[18px] mb-3 md:mb-4">
                Quick Links
              </h3>
              <ul className="space-y-1 md:space-y-2">
                <li>
                  <Link
                    href="/"
                    className="[font-family:'Tajawal',Helvetica] text-[11px] md:text-[14px] text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="[font-family:'Tajawal',Helvetica] text-[11px] md:text-[14px] text-gray-300 hover:text-white transition-colors"
                  >
                    Projects
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="[font-family:'Tajawal',Helvetica] text-[11px] md:text-[14px] text-gray-300 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="[font-family:'Tajawal',Helvetica] text-[11px] md:text-[14px] text-gray-300 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="[font-family:'Tajawal',Helvetica] font-semibold text-[14px] md:text-[18px] mb-3 md:mb-4">
                Contact Info
              </h3>
              <div className="space-y-1 md:space-y-2 text-[11px] md:text-[14px] text-gray-300">
                <p className="[font-family:'Tajawal',Helvetica]">EL RACE UAE</p>
                <p className="[font-family:'Tajawal',Helvetica]">+20 2 1234 5678</p>
                <p className="[font-family:'Tajawal',Helvetica]">careers@elrace.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-4 md:mt-8 pt-4 md:pt-8 text-center">
            <p className="[font-family:'Tajawal',Helvetica] text-[10px] md:text-[14px] text-gray-300">
              © 2024 EL RACE. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}