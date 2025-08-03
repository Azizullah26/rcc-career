import { LogInIcon, ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

// Button Component
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
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
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// Toggle Group Components
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Item>
));

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export const ExtendedApplicationQuestions = (): JSX.Element => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  // State for form data
  const [previousWork, setPreviousWork] = useState("");
  const [workDetails, setWorkDetails] = useState("");
  const [relativesOrFriends, setRelativesOrFriends] = useState("");
  const [names, setNames] = useState("");
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([]);

  // Navigation items data
  const navItems = [
    { name: "HOME", href: "/" },
    { name: "PROJECTS", href: "#" },
    { name: "BLOGS", href: "#" },
    { name: "CONTACTS", href: "#" },
    { name: "SEARCH CAREERS", href: "/search-careers" },
    { name: "CAREERS", href: "/" },
  ];

  // Relationship options data
  const relationshipOptions = [
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Spouse",
    "Uncle",
    "Aunt",
    "Friend",
  ];

  const handleRelationshipToggle = (relationship: string) => {
    setSelectedRelationships(prev => 
      prev.includes(relationship) 
        ? prev.filter(r => r !== relationship)
        : [...prev, relationship]
    );
  };

  const handleSubmit = () => {
    const formData = {
      previousWork,
      workDetails,
      relativesOrFriends,
      names,
      selectedRelationships
    };
    console.log("Extended application questions submitted:", formData);
    navigate(`/add-experience/${jobId}`);
  };

  return (
    <div className="bg-transparent flex flex-row justify-center w-full">
      <div className="bg-[linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)] w-[1280px] relative">
        {/* Header/Navigation Bar */}
        <header className="w-full h-[91px] bg-[#ebebeb] flex items-center justify-between px-[68px]">
          <div className="flex items-center">
            <img
              className="w-[150px] h-[68px]"
              alt="EL RACE Logo"
              src="/pre-comp-2-1.svg"
            />
            <button
              onClick={() => navigate(-1)}
              className="ml-4 flex items-center gap-2 text-[#656565] hover:text-[#151d61] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="[font-family:'Tajawal',Helvetica] font-normal text-[18px]">
                Back
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-[34px] mr-[29px]">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[18.7px] whitespace-nowrap hover:text-[#151d61] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-[29px] ml-[60px]">
              <Button
                variant="outline"
                className="w-[104px] h-[39px] rounded-[9px] border border-solid border-[#151d61] text-[#151d61] hover:bg-[#151d61] hover:text-white transition-colors"
              >
                <LogInIcon className="w-[23px] h-[23px] mr-[5px]" />
                <span className="[font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[19.7px]">
                  Sign in
                </span>
              </Button>

              <Button
                variant="outline"
                className="w-[104px] h-[39px] rounded-[9px] border border-solid border-[#ce363a] text-[#ce363a] hover:bg-[#ce363a] hover:text-white transition-colors"
              >
                <img
                  className="w-[21.69px] h-[21.69px] mr-[5px]"
                  alt="Language"
                  src="/language.svg"
                />
                <span className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[18.7px] text-left whitespace-nowrap [direction:rtl]">
                  العربيــة
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-[100px] pt-[46px] pb-[100px]">
          <h1 className="w-full text-center [font-family:'Inter',Helvetica] font-bold text-[#151d61] text-[24.6px] mb-[80px]">
            APPLICATION QUESTIONS
          </h1>

          {/* Previous Work Question */}
          <section className="mb-[80px]">
            <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-[22.4px] mb-[20px]">
              Have you previously worked with EL RACE
            </h2>

            <ToggleGroup 
              type="single" 
              value={previousWork}
              onValueChange={setPreviousWork}
              className="flex gap-[20px]"
            >
              <ToggleGroupItem
                value="yes"
                className="w-[127px] h-[55px] bg-[#d9d9d9] rounded-[35.66px] [font-family:'Inter',Helvetica] font-semibold text-black text-[29.6px] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470]"
              >
                yes
              </ToggleGroupItem>
              <ToggleGroupItem
                value="no"
                className="w-[127px] h-[55px] bg-[#d9d9d9] rounded-[35.68px] [font-family:'Inter',Helvetica] font-semibold text-black text-[29.6px] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470]"
              >
                No
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="mt-[40px]">
              <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-[22.4px] mb-[10px]">
                Please give details about your work with EL RACE
              </h2>
              <Input 
                value={workDetails}
                onChange={(e) => setWorkDetails(e.target.value)}
                className="w-full h-[78px] bg-white rounded-[79px] border border-solid border-[#d9d9d9]" 
              />
            </div>
          </section>

          {/* Relatives/Friends Question */}
          <section className="mb-[80px]">
            <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-[22.4px] mb-[20px]">
              Do you have any Relatives/Friends working with EL RACE
            </h2>

            <ToggleGroup 
              type="single" 
              value={relativesOrFriends}
              onValueChange={setRelativesOrFriends}
              className="flex gap-[20px]"
            >
              <ToggleGroupItem
                value="yes"
                className="w-[127px] h-[55px] bg-[#d9d9d9] rounded-[35.66px] [font-family:'Inter',Helvetica] font-semibold text-black text-[29.6px] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470]"
              >
                yes
              </ToggleGroupItem>
              <ToggleGroupItem
                value="no"
                className="w-[127px] h-[55px] bg-[#d9d9d9] rounded-[35.68px] [font-family:'Inter',Helvetica] font-semibold text-black text-[29.6px] data-[state=on]:bg-[#151d61] data-[state=on]:text-white hover:bg-[#c9c9c9] data-[state=on]:hover:bg-[#1a2470]"
              >
                No
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="mt-[40px]">
              <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-[22.4px] mb-[10px]">
                Please specify the names of Relatives/Friends
              </h2>
              <Input 
                value={names}
                onChange={(e) => setNames(e.target.value)}
                className="w-full h-[78px] bg-white rounded-[79px] border border-solid border-[#d9d9d9]" 
              />
            </div>
          </section>

          {/* Relationship Section */}
          <section className="mb-[80px]">
            <h2 className="[font-family:'Inter',Helvetica] font-normal text-black text-[22.4px] mb-[20px]">
              Relationship
            </h2>

            <div className="flex flex-wrap gap-[20px]">
              {relationshipOptions.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleRelationshipToggle(option)}
                  className={cn(
                    "h-[46px] bg-[#d9d9d9] rounded-[30px] [font-family:'Inter',Helvetica] font-semibold text-black text-[24px] border-none hover:bg-[#c9c9c9] transition-colors",
                    selectedRelationships.includes(option) && "bg-[#151d61] text-white hover:bg-[#1a2470]"
                  )}
                >
                  {option}
                </Button>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-center gap-[90px] mt-[40px]">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-[138px] h-[60px] bg-[#d9d9d9] rounded-[38.79px] [font-family:'Inter',Helvetica] font-medium text-black text-[32.2px] border-none hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleSubmit}
              className="w-[138px] h-[60px] bg-[#151d61] rounded-[38.77px] [font-family:'Inter',Helvetica] font-medium text-white text-[32.2px] border-none hover:bg-[#1a2470] transition-colors"
            >
              Next
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};