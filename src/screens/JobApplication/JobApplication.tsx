import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LogInIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../components/ui/toggle-group";
import { Link } from "react-router-dom";

// Define the form schema
const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  dob: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  gender: z.string().min(1, "Gender is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  totalExperience: z.string().min(1, "Total experience is required"),
  egyptExperience: z.string().min(1, "Egypt experience is required"),
  currentLocation: z.string().min(1, "Current location is required"),
  expectedSalary: z.string().min(1, "Expected salary is required"),
  joiningPossibility: z.string().min(1, "Joining possibility is required"),
  egyptDrivingLicense: z.string().default("yes"),
  relocationPossibility: z.string().default("yes"),
  firstLanguage: z.string().default("arabic"),
  secondLanguage: z.string().default("english"),
});

type FormData = z.infer<typeof formSchema>;

export const JobApplication = (): JSX.Element => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  // Navigation menu items
  const navItems = [
    { name: "HOME", href: "/" },
    { name: "PROJECTS", href: "#" },
    { name: "BLOGS", href: "#" },
    { name: "CONTACTS", href: "#" },
    { name: "SEARCH CAREERS", href: "/search-careers" },
    { name: "CAREERS", href: "/" },
  ];

  // Initialize the form with react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      nationality: "",
      gender: "",
      maritalStatus: "",
      totalExperience: "",
      egyptExperience: "",
      currentLocation: "",
      expectedSalary: "",
      joiningPossibility: "",
      egyptDrivingLicense: "yes",
      relocationPossibility: "yes",
      firstLanguage: "arabic",
      secondLanguage: "english",
    },
  });

  // Form fields data
  const formFields = [
    { id: "fullName", label: "Full Name*", type: "text" },
    { id: "email", label: "Email Address*", type: "email" },
    { id: "phone", label: "Phone Number*", type: "tel" },
    { id: "dob", label: "Date of Birth*", type: "date" },
    { id: "nationality", label: "Nationality*", type: "text" },
    { id: "gender", label: "Gender*", type: "text" },
    { id: "maritalStatus", label: "Marital Status*", type: "text" },
    { id: "totalExperience", label: "Total Experience*", type: "text" },
    { id: "egyptExperience", label: "UAE Experience*", type: "text" },
    { id: "currentLocation", label: "Current Location*", type: "text" },
    { id: "expectedSalary", label: "Expected Salary*", type: "text" },
    { id: "joiningPossibility", label: "Joining Possibility*", type: "text" },
  ];

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // Navigate to application questions page
    navigate(`/application-questions/${jobId}`);
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1280px] relative min-h-screen">
        {/* Header/Navigation */}
        <header className="absolute w-full h-[91px] top-0 left-0 bg-[#ebebeb]">
          <div className="flex items-center justify-between px-[68px] h-full">
            {/* Logo and Back Button */}
            <div className="flex items-center">
              <img
                className="w-[150px] h-[68px]"
                alt="EL RACE Logo"
                src="/pre-comp-2-1.svg"
              />
            </div>

            <div className="flex items-center justify-between gap-10">
              <nav className="flex items-center gap-[34px]">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[18.7px] tracking-[0] leading-normal whitespace-nowrap text-[#656565] hover:text-[#151d61] transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-[29px] ml-[60px]">
                <Button
                  variant="outline"
                  className="flex items-center gap-[5px] h-[39px] w-[104px] rounded-[9px] border border-solid border-[#151d61] bg-transparent hover:bg-[#151d61] hover:text-white transition-colors"
                >
                  <img
                    className="w-[23px] h-[23px]"
                    alt="Log in"
                    src="/log-in.svg"
                  />
                  <span className="[font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[#151d61] text-[19.7px]">
                    Sign in
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-[5px] h-[39px] w-[104px] rounded-[9px] border border-solid border-[#ce363a] bg-transparent hover:bg-[#ce363a] hover:text-white transition-colors"
                >
                  <img
                    className="w-[21.69px] h-[21.69px]"
                    alt="Language"
                    src="/language.svg"
                  />
                  <span className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#ce363a] text-[18.7px] text-left tracking-[0] leading-normal whitespace-nowrap [direction:rtl]">
                    العربيــة
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-[120px] px-[85px] pb-10">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#656565] hover:text-[#151d61] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="[font-family:'Tajawal',Helvetica] font-normal text-[18px]">
                Back
              </span>
            </button>
          </div>

          {/* Page Title */}
          <Card className="w-full border-none shadow-none mb-8">
            <CardContent className="p-0 text-center">
              <h1 className="font-sans font-bold text-[33.6px] text-[#151d61] tracking-normal">
                Job Application – Personal Information
              </h1>
              <p className="font-sans font-medium text-[24.6px] text-[#909090] underline mt-1">
                please enter your information
              </p>
            </CardContent>
          </Card>

          {/* Application Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col w-full items-start gap-[23px] relative">
                {formFields.map((field) => (
                  <FormField
                    key={field.id}
                    name={field.id as keyof FormData}
                    render={({ field: formField }) => (
                      <FormItem className="flex flex-col items-center gap-3 relative self-stretch w-full">
                        <Label className="self-stretch h-[26px] [font-family:'Inter',Helvetica] font-semibold text-black text-[21.6px] tracking-[0] leading-[normal]">
                          {field.label}
                        </Label>
                        <FormControl>
                          <Input 
                            {...formField}
                            type={field.type}
                            className="self-stretch w-full h-14 bg-[#d9d9d9] rounded-[47px] border border-solid border-black" 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}

                <div className="flex flex-col w-full items-start gap-[39px] relative">
                  {/* Egypt Driving license toggle */}
                  <FormField
                    name="egyptDrivingLicense"
                    render={({ field }) => (
                      <FormItem className="flex flex-col h-[105px] items-start gap-6 relative self-stretch w-full">
                        <Label className="flex-1 self-stretch mt-[-1.00px] [font-family:'Inter',Helvetica] font-semibold text-black text-[21.6px] tracking-[0] leading-[normal]">
                          UAE Driving License*
                        </Label>
                        <FormControl>
                          <ToggleGroup
                            type="single"
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex w-[274px] h-[55px] items-center gap-5 relative"
                          >
                            <ToggleGroupItem
                              value="yes"
                              className="w-[126.92px] h-[55px] gap-[6.04px] px-[36.87px] py-[9.67px] rounded-[35.66px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[29.6px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white"
                            >
                              Yes
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value="no"
                              className="w-[127px] h-[55.03px] gap-[6.05px] px-[36.89px] py-[9.68px] rounded-[35.68px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[29.6px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white"
                            >
                              No
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Relocation Possibility toggle */}
                  <FormField
                    name="relocationPossibility"
                    render={({ field }) => (
                      <FormItem className="flex flex-col h-[105px] items-start gap-6 relative self-stretch w-full">
                        <Label className="flex-1 self-stretch mt-[-1.00px] [font-family:'Inter',Helvetica] font-semibold text-black text-[21.6px] tracking-[0] leading-[normal]">
                          Relocation Possibility*
                        </Label>
                        <FormControl>
                          <ToggleGroup
                            type="single"
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex w-[274px] h-[55px] items-center gap-5 relative"
                          >
                            <ToggleGroupItem
                              value="yes"
                              className="w-[126.92px] h-[55px] gap-[6.04px] px-[36.87px] py-[9.67px] rounded-[35.66px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[29.6px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white"
                            >
                              Yes
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value="no"
                              className="w-[127px] h-[55.03px] gap-[6.05px] px-[36.89px] py-[9.68px] rounded-[35.68px] flex items-center justify-center bg-[#d9d9d9] [font-family:'Inter',Helvetica] font-semibold text-black text-[29.6px] tracking-[0] leading-[normal] data-[state=on]:bg-[#151d61] data-[state=on]:text-white"
                            >
                              No
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Languages section */}
                  <div className="flex flex-col h-[123px] items-start gap-3.5 relative self-stretch w-full">
                    <Label className="self-stretch mt-[-1.00px] [font-family:'Inter',Helvetica] font-semibold text-black text-[21.6px] tracking-[0] leading-[normal]">
                      Languages*
                    </Label>
                    <div className="flex items-start gap-10 relative self-stretch w-full flex-[0_0_auto] mb-[-3.00px]">
                      {/* First Language */}
                      <FormField
                        name="firstLanguage"
                        render={({ field }) => (
                          <FormItem className="relative w-[194px] h-[82px]">
                            <Label className="absolute top-0 left-0 [font-family:'Inter',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal]">
                              First Language
                            </Label>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-[190px] h-14 top-[26px] bg-[#d9d9d9] rounded-[47px] border border-solid border-black absolute left-0">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="arabic">ARABIC</SelectItem>
                                  <SelectItem value="english">English</SelectItem>
                                  <SelectItem value="french">French</SelectItem>
                                  <SelectItem value="german">German</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Second Language */}
                      <FormField
                        name="secondLanguage"
                        render={({ field }) => (
                          <FormItem className="relative w-[194px] h-[83px]">
                            <Label className="absolute top-0 left-0 [font-family:'Inter',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal]">
                              Second Language
                            </Label>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-[190px] h-14 top-[27px] bg-[#d9d9d9] rounded-[47px] border border-solid border-black absolute left-0">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="arabic">ARABIC</SelectItem>
                                  <SelectItem value="english">English</SelectItem>
                                  <SelectItem value="french">French</SelectItem>
                                  <SelectItem value="german">German</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Add More Button */}
                      <div className="relative w-[83px] h-[86px]">
                        <div className="flex flex-col w-[83px] items-center relative">
                          <Label className="relative w-fit mt-[-1.00px] ml-[-6.50px] mr-[-6.50px] [font-family:'Inter',Helvetica] font-normal text-black text-lg tracking-[0] leading-[normal]">
                            ADD MORE
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            className="relative w-[54px] h-14 mt-2 bg-[#d9d9d9] rounded-[47px] border border-solid border-black flex items-center justify-center hover:bg-[#c9c9c9]"
                          >
                            <span className="[font-family:'Inter',Helvetica] font-light text-[#505050] text-[51px] tracking-[0] leading-[normal]">
                              +
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-center gap-[90px] my-10">
                <Button
                  type="button"
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="w-[138px] h-[60px] rounded-[38px] text-black text-[32px] font-medium bg-[#d9d9d9] hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="outline"
                  className="w-[138px] h-[60px] rounded-[38px] text-white text-[32px] font-medium bg-[#151d61] hover:bg-[#1a2470] transition-colors border-[#151d61]"
                >
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </main>
      </div>
    </div>
  );
};