"use client"

import { LogInIcon, ArrowLeft, Menu, X } from "lucide-react"
import React, { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { cn } from "../../lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

// Button Component
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

// Toggle Group Components
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root ref={ref} className={cn("flex items-center justify-center gap-1", className)} {...props}>
    {children}
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      className,
    )}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Item>
))

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export const ExtendedApplicationQuestions = (): JSX.Element => {
  const router = useRouter()
  const { jobId } = useParams<{ jobId: string }>()

  // State for form data
  const [previousWork, setPreviousWork] = useState("")
  const [workDetails, setWorkDetails] = useState("")
  const [relativesOrFriends, setRelativesOrFriends] = useState("")
  const [names, setNames] = useState("")
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([])

  // Navigation items data
  const navItems = [
    { name: "HOME", href: "/" },
    { name: "PROJECTS", href: "#" },
    { name: "BLOGS", href: "#" },
    { name: "CONTACTS", href: "#" },
    { name: "SEARCH CAREERS", href: "/search-careers" },
    { name: "CAREERS", href: "/" },
  ]

  // Relationship options data
  const relationshipOptions = ["Father", "Mother", "Brother", "Sister", "Spouse", "Uncle", "Aunt", "Friend"]

  const handleRelationshipToggle = (relationship: string) => {
    setSelectedRelationships((prev) =>
      prev.includes(relationship) ? prev.filter((r) => r !== relationship) : [...prev, relationship],
    )
  }

  const handleSubmit = () => {
    const formData = {
      previousWork,
      workDetails,
      relativesOrFriends,
      names,
      selectedRelationships,
    }
    console.log("Extended application questions submitted:", formData)
    router.push(`/add-experience/${jobId}`)
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="bg-transparent flex flex-row justify-center w-full">
      <div className="bg-[linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)] w-[1280px] relative">
        {/* Header/Navigation Bar */}
        <header className="fixed w-full h-[70px] md:h-[91px] bg-[#ebebeb] flex items-center justify-between px-4 md:px-[68px] top-0 left-0 z-50">
          <div className="flex items-center">
            <img className="w-[100px] h-[45px] md:w-[150px] md:h-[68px]" alt="EL RACE Logo" src="/pre-comp-2-1.svg" />
            <button
              onClick={() => router.back()}
              className="ml-2 md:ml-4 flex items-center gap-1 md:gap-2 text-[#656565] hover:text-[#151d61] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="[font-family:'Tajawal',Helvetica] font-normal text-[14px] md:text-[18px]">Back</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between">
            <nav className="flex items-center gap-[34px] mr-[29px]">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[18.7px] whitespace-nowrap hover:text-[#151d61] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-[29px] ml-[60px]">
              <Button
                variant="outline"
                className="w-[104px] h-[39px] rounded-[9px] border border-solid border-[#151d61] text-[#151d61] hover:bg-[#151d61] hover:text-white transition-colors bg-transparent"
              >
                <LogInIcon className="w-[23px] h-[23px] mr-[5px]" />
                <span className="[font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[19.7px]">
                  Sign in
                </span>
              </Button>

              <Button
                variant="outline"
                className="w-[104px] h-[39px] rounded-[9px] border border-solid border-[#ce363a] text-[#ce363a] hover:bg-[#ce363a] hover:text-white transition-colors bg-transparent"
              >
                <img className="w-[21.69px] h-[21.69px] mr-[5px]" alt="Language" src="/language.svg" />
                <span className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[18.7px] text-left whitespace-nowrap [direction:rtl]">
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

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed top-[70px] md:top-[91px] left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
              <nav className="flex flex-col p-4">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="py-3 px-2 [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[16px] md:text-[18px] transition-colors hover:text-[#151d61]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-[45px] rounded-[9px] border border-solid border-[#151d61] bg-transparent hover:bg-[#151d61] hover:text-white transition-colors"
                  >
                    <LogInIcon className="w-[20px] h-[20px]" />
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
        <main className="px-4 md:px-[100px] pt-[100px] md:pt-[137px] pb-[60px] md:pb-[100px]">
          <h1 className="w-full text-center [font-family:'Inter',Helvetica] font-bold text-[#151d61] text-[12px] md:text-[24.6px] mb-[20px] md:mb-[80px]">
            APPLICATION QUESTIONS
          </h1>

          {/* Previous Work Question */}
          <section className="mb-[40px] md:mb-[80px]">
            <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-[16px] md:text-[22.4px] mb-[12px] md:mb-[20px]">
              Have you previously worked with EL RACE
            </h2>

            <ToggleGroup
              type="single"
              value={previousWork}
              onValueChange={setPreviousWork}
              className="flex gap-[12px] md:gap-[20px]"
            >
              <ToggleGroupItem
                value="yes"
                className="w-[90px] md:w-[127px] h-[40px] md:h-[55px] bg-[#d9d9d9] rounded-[35.66px] [font-family:'Inter',Helvetica] font-semibold text-black text-[18px] md:text-[29.6px] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470]"
              >
                yes
              </ToggleGroupItem>
              <ToggleGroupItem
                value="no"
                className="w-[90px] md:w-[127px] h-[40px] md:h-[55px] bg-[#d9d9d9] rounded-[35.68px] [font-family:'Inter',Helvetica] font-semibold text-black text-[18px] md:text-[29.6px] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470]"
              >
                No
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="mt-[20px] md:mt-[40px]">
              <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-[16px] md:text-[22.4px] mb-[6px] md:mb-[10px]">
                Please give details about your work with EL RACE
              </h2>
              <Input
                value={workDetails}
                onChange={(e) => setWorkDetails(e.target.value)}
                className="w-full h-[50px] md:h-[78px] bg-white rounded-[79px] border border-solid border-[#d9d9d9] text-sm md:text-base"
              />
            </div>
          </section>

          {/* Relatives/Friends Question */}
          <section className="mb-[40px] md:mb-[80px]">
            <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-[16px] md:text-[22.4px] mb-[12px] md:mb-[20px]">
              Do you have any Relatives/Friends working with EL RACE
            </h2>

            <ToggleGroup
              type="single"
              value={relativesOrFriends}
              onValueChange={setRelativesOrFriends}
              className="flex gap-[12px] md:gap-[20px]"
            >
              <ToggleGroupItem
                value="yes"
                className="w-[90px] md:w-[127px] h-[40px] md:h-[55px] bg-[#d9d9d9] rounded-[35.66px] [font-family:'Inter',Helvetica] font-semibold text-black text-[18px] md:text-[29.6px] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470]"
              >
                yes
              </ToggleGroupItem>
              <ToggleGroupItem
                value="no"
                className="w-[90px] md:w-[127px] h-[40px] md:h-[55px] bg-[#d9d9d9] rounded-[35.68px] [font-family:'Inter',Helvetica] font-semibold text-black text-[18px] md:text-[29.6px] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470]"
              >
                No
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="mt-[20px] md:mt-[40px]">
              <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-[16px] md:text-[22.4px] mb-[6px] md:mb-[10px]">
                Please specify the names of Relatives/Friends
              </h2>
              <Input
                value={names}
                onChange={(e) => setNames(e.target.value)}
                className="w-full h-[50px] md:h-[78px] bg-white rounded-[79px] border border-solid border-[#d9d9d9] text-sm md:text-base"
              />
            </div>
          </section>

          {/* Relationship Section */}
          <section className="mb-[40px] md:mb-[80px]">
            <h2 className="[font-family:'Inter',Helvetica] font-normal text-black text-[16px] md:text-[22.4px] mb-[12px] md:mb-[20px]">
              Relationship
            </h2>

            <div className="flex flex-wrap gap-[10px] md:gap-[20px]">
              {relationshipOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleRelationshipToggle(option)}
                  className={cn(
                    "h-[35px] md:h-[46px] bg-[#d9d9d9] rounded-[30px] [font-family:'Inter',Helvetica] font-semibold text-black text-[16px] md:text-[24px] border-none hover:bg-[#c9c9c9] transition-colors px-3 md:px-6",
                    selectedRelationships.includes(option) && "bg-[#151d61] text-white hover:bg-[#1a2470]",
                  )}
                >
                  {option}
                </Button>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-[90px] mt-[20px] md:mt-[40px]">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-full md:w-[138px] h-[45px] md:h-[60px] bg-[#d9d9d9] rounded-[38.79px] [font-family:'Inter',Helvetica] font-medium text-black text-[20px] md:text-[32.2px] border-none hover:bg-gray-300 transition-colors order-2 md:order-1"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleSubmit}
              className="w-full md:w-[138px] h-[45px] md:h-[60px] bg-[#151d61] rounded-[38.77px] [font-family:'Inter',Helvetica] font-medium text-white text-[20px] md:text-[32.2px] border-none hover:bg-[#1a2470] transition-colors order-1 md:order-2"
            >
              Next
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
