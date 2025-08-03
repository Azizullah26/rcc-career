import { LogInIcon, ArrowLeft, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export const AddExperience = (): JSX.Element => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  // State for managing experience cards
  const [experienceCards, setExperienceCards] = useState([1, 2]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Navigation menu items
  const navItems = [
    { name: "HOME", href: "/" },
    { name: "PROJECTS", href: "#" },
    { name: "BLOGS", href: "#" },
    { name: "CONTACTS", href: "#" },
    { name: "SEARCH CAREERS", href: "/search-careers" },
    { name: "CAREERS", href: "/" },
  ];

  // Form fields for each experience card
  const formFields = [
    { label: "Company Name*", id: "company-name", type: "text" },
    { label: "Job Title*", id: "job-title", type: "text" },
    { label: "Start Date*", id: "start-date", type: "date" },
    { label: "End Date*", id: "end-date", type: "date" },
  ];

  const addExperienceCard = () => {
    setExperienceCards([...experienceCards, experienceCards.length + 1]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        setUploadedFile(file);
        console.log('File uploaded:', file.name);
      } else {
        alert('Please upload a PDF, DOC, or DOCX file.');
        event.target.value = '';
      }
    }
  };

  const triggerFileUpload = () => {
    const fileInput = document.getElementById('cv-upload') as HTMLInputElement;
    fileInput?.click();
  };

  const handleSubmit = () => {
    console.log("Application submitted successfully!");
    if (uploadedFile) {
      console.log("CV file:", uploadedFile.name);
    }
    navigate("/application-success");
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

            {/* Navigation */}
            <nav className="flex items-center justify-between">
              <ul className="flex items-center gap-[34px] mr-[29px]">
                {navItems.map((item, index) => (
                  <li
                    key={index}
                    className="inline-flex items-center justify-center"
                  >
                    <Link
                      to={item.href}
                      className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[18.7px] whitespace-nowrap hover:text-[#151d61] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Sign in and language buttons */}
              <div className="flex items-center gap-[29px] ml-[60px]">
                <Button
                  variant="outline"
                  className="h-[39px] w-[104px] rounded-[9px] border-[#151d61] text-[#151d61] hover:bg-[#151d61] hover:text-white transition-colors"
                >
                  <LogInIcon className="w-[23px] h-[23px] mr-[5px]" />
                  <span className="[font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[19.7px]">
                    Sign in
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="h-[39px] w-[104px] rounded-[9px] border-[#ce363a] text-[#ce363a] hover:bg-[#ce363a] hover:text-white transition-colors"
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
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-[120px] px-[123px] pb-[100px]">
          {/* Page Title */}
          <h1 className="text-center [font-family:'Inter',Helvetica] font-bold text-[#151d61] text-[24.6px] mb-[60px]">
            Please provide details about your latest work experience
          </h1>

          {/* Experience Cards Container */}
          <div className="flex flex-col w-full max-w-[1021px] mx-auto items-center gap-[30px]">
            {/* Experience Cards */}
            {experienceCards.map((cardNumber) => (
              <Card 
                key={cardNumber}
                className="flex flex-col h-auto items-center gap-2.5 px-[46px] py-[31px] w-full bg-[#ffffff7a] rounded-[45px] border border-solid border-black"
              >
                <CardContent className="flex flex-col items-center justify-between w-full p-0 gap-6">
                  {formFields.map((field, index) => (
                    <div
                      key={`field${cardNumber}-${index}`}
                      className="flex flex-col items-start w-full"
                    >
                      <label className="mb-2 [font-family:'Inter',Helvetica] font-semibold text-black text-[22.4px] tracking-[0] leading-[normal]">
                        {field.label}
                      </label>
                      <Input
                        id={`${field.id}-${cardNumber}`}
                        type={field.type}
                        className="w-full h-[78px] bg-white rounded-[79px] border border-solid border-black px-6 text-lg"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* Add More Button */}
            <Button
              onClick={addExperienceCard}
              variant="outline"
              className="flex flex-col w-[108px] items-center p-0 border-none bg-transparent hover:bg-transparent"
            >
              <div className="w-[72px] h-[72px] bg-white rounded-full border border-solid border-black flex items-center justify-center hover:bg-gray-50 transition-colors">
                <PlusIcon className="text-[#151d61] w-[44px] h-[44px]" />
              </div>
            </Button>

            {/* Bottom Action Buttons */}
            <div className="flex flex-col w-[244px] items-center gap-[27px] mt-[60px]">
              {/* Hidden file input */}
              <input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              
              <Button
                onClick={triggerFileUpload}
                variant="outline"
                className="h-[54px] w-full rounded-[47px] border-[3px] border-solid border-[#151d61] text-[#151d61] hover:bg-[#151d61] hover:text-white transition-colors"
              >
                <span className="[font-family:'Inter',Helvetica] font-bold text-[23.7px]">
                  {uploadedFile ? `CV: ${uploadedFile.name}` : "Upload Your CV"}
                </span>
              </Button>

              <Button 
                onClick={handleSubmit}
                className="w-[207px] h-[67px] bg-[#151d61] rounded-[16px] hover:bg-[#1a2470] transition-colors"
              >
                <span className="[font-family:'Tajawal',Helvetica] font-bold text-white text-[36.6px]">
                  Apply
                </span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};