"use client"

import React from "react"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../components/ui/navigation-menu"
import { LogInIcon, Menu, X } from "lucide-react"

export const ApplicationSuccess = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Navigation menu items data
  const navItems = [
    { label: "HOME", marginLeft: "ml-[-96.50px]" },
    { label: "PROJECTS", marginLeft: "ml-[-12.50px]" },
    { label: "BLOGS", marginLeft: "" },
    { label: "CONTACTS", marginLeft: "", width: "w-[86px]" },
    { label: "SEARCH CAREERS", marginLeft: "" },
    { label: "CAREERS", marginLeft: "", marginRight: "mr-[-96.50px]" },
  ]

  return (
    <div className="bg-transparent flex flex-row justify-center w-full">
      <div className="bg-[linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)] w-full max-w-[1280px] h-auto min-h-[848px] relative">
        {/* Header/Navigation Bar */}
        <header className="absolute w-full h-[91px] top-0 left-0 bg-white">
          <div className="flex items-center justify-between px-4 md:px-[103px] h-full">
            {/* Company Logo */}
            <Link href="/">
              <img
                className="w-[120px] h-[54px] md:w-[150px] md:h-[68px] cursor-pointer hover:opacity-80 transition-opacity"
                alt="Company logo"
                src="/pre-comp-2-1.svg"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-between">
              <NavigationMenu className="flex items-center justify-center gap-[34px] relative">
                <NavigationMenuList>
                  {navItems.map((item, index) => (
                    <NavigationMenuItem
                      key={index}
                      className={`inline-flex items-center justify-center gap-2.5 relative flex-[0_0_auto] ${item.marginLeft || ""} ${item.marginRight || ""}`}
                    >
                      <NavigationMenuLink
                        className={`relative ${item.width || "w-fit"} mt-[-1.00px] [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[18.7px] tracking-[0] leading-[normal] whitespace-nowrap hover:text-[#151d61] transition-colors cursor-pointer`}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>

              <div className="inline-flex items-center gap-[29px] relative flex-[0_0_auto] ml-[60px]">
                <Button
                  variant="outline"
                  className="flex flex-col w-[104px] h-[39px] items-center justify-center gap-2.5 px-[5px] py-[3px] relative rounded-[9px] border border-solid border-[#151d61] hover:bg-[#151d61] hover:text-white transition-colors bg-transparent"
                >
                  <div className="inline-flex items-center gap-[5px] relative flex-[0_0_auto]">
                    <LogInIcon className="relative w-[23px] h-[23px] text-[#151d61]" />
                    <span className="relative w-fit mt-[-1.00px] [font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[#151d61] text-[19.7px] tracking-[0] leading-[normal]">
                      Sign in
                    </span>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col w-[104px] h-[39px] items-center justify-center gap-2.5 px-[5px] py-[3px] relative rounded-[9px] border border-solid border-[#ce363a] hover:bg-[#ce363a] hover:text-white transition-colors bg-transparent"
                >
                  <div className="inline-flex items-center gap-[5px] relative flex-[0_0_auto]">
                    <img className="relative w-[21.69px] h-[21.69px]" alt="Language" src="/language.svg" />
                    <span className="relative w-fit mt-[-1.00px] [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#ce363a] text-[18.7px] text-left tracking-[0] leading-[normal] whitespace-nowrap [direction:rtl]">
                      العربيــة
                    </span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#151d61]" />
              ) : (
                <Menu className="w-6 h-6 text-[#151d61]" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-[91px] left-0 right-0 bg-white border-t border-gray-200 z-50">
              <nav className="flex flex-col p-4">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="py-3 px-2 [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[18px] transition-colors hover:text-[#151d61]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-[39px] rounded-[9px] border border-solid border-[#151d61] bg-transparent hover:bg-[#151d61] hover:text-white transition-colors"
                  >
                    <LogInIcon className="w-[20px] h-[20px]" />
                    <span className="[font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[#151d61] text-[16px]">
                      Sign in
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-[39px] rounded-[9px] border border-solid border-[#ce363a] bg-transparent hover:bg-[#ce363a] hover:text-white transition-colors"
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

        {/* Success Message Section */}
        <section className="absolute w-[90%] md:w-[1173px] h-auto top-[150px] md:top-[234px] left-1/2 transform -translate-x-1/2 flex flex-col items-center px-4">
          <h1 className="w-full [font-family:'Inter',Helvetica] text-[#151d61] text-[20px] sm:text-[32px] md:text-[59.4px] text-center tracking-[0] leading-[normal] mb-4">
            <span className="font-bold">
              Your Application
              <br />
            </span>
            <span className="font-medium">has been submitted Successfully</span>
          </h1>

          {/* Success Check Mark */}
          <div className="w-[120px] sm:w-[150px] md:w-[188px] h-[120px] sm:h-[150px] md:h-[188px] mt-[18px] flex items-center justify-center">
            <div className="w-[120px] sm:w-[150px] md:w-[188px] h-[120px] sm:h-[150px] md:h-[188px] bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-[70px] sm:w-[90px] md:w-[120px] h-[70px] sm:h-[90px] md:h-[120px] text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Return to Home Button */}
          <div className="mt-[30px] md:mt-[40px]">
            <Link href="/">
              <Button className="w-[150px] sm:w-[180px] md:w-[200px] h-[40px] sm:h-[45px] md:h-[50px] bg-[#151d61] hover:bg-[#1a2470] text-white rounded-lg [font-family:'Tajawal',Helvetica] font-semibold text-[14px] sm:text-[16px] md:text-[18px] transition-colors">
                Return to Home
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
