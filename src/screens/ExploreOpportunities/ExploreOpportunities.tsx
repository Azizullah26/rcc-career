import { ArrowLeft, ArrowDownIcon, ArrowUpIcon, ListIcon, MapPinIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

// Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className = "", children, ...props }) => {
  return (
    <div 
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

// CardContent Component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

// Separator Component
interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const Separator: React.FC<SeparatorProps> = ({ 
  orientation = "horizontal", 
  className = "" 
}) => {
  return (
    <div 
      className={`shrink-0 bg-border ${
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"
      } ${className}`} 
    />
  );
};

// ToggleGroup Components
interface ToggleGroupProps {
  type: "single" | "multiple";
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({ className = "", children, ...props }) => {
  return (
    <div className={`inline-flex ${className}`} {...props}>
      {children}
    </div>
  );
};

interface ToggleGroupItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({ className = "", children, ...props }) => {
  return (
    <button className={`inline-flex items-center justify-center ${className}`} {...props}>
      {children}
    </button>
  );
};

export const ExploreOpportunities = (): JSX.Element => {
  const navigate = useNavigate();
  
  // State for filters
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Navigation menu items
  const navItems = [
    { label: "HOME", href: "/" },
    { label: "PROJECTS", href: "#" },
    { label: "BLOGS", href: "#" },
    { label: "CONTACTS", href: "#" },
    { label: "SEARCH CAREERS", href: "/search-careers" },
    { label: "CAREERS", href: "/" },
  ];

  // Job listings data
  const jobListings = [
    {
      id: 1,
      title: "Senior Civil Engineer",
      department: "Engineering",
      location: "Abu Dhabi, UAE",
      type: "Full-time",
      experience: "5+ years",
      postingDate: "07/04/2025",
      description: "Lead major infrastructure projects and manage engineering teams in delivering government contracts. This function is to ensure exceptional project delivery in a highly empowered environment.",
      requirements: [
        "Bachelor's degree in Civil Engineering",
        "5+ years of experience in construction projects",
        "Project management certification preferred",
        "Strong leadership and communication skills"
      ]
    },
    {
      id: 2,
      title: "Project Manager",
      department: "Operations",
      location: "Dubai, UAE",
      type: "Full-time",
      experience: "7+ years",
      postingDate: "07/04/2025",
      description: "Oversee large-scale government projects from planning to completion, ensuring quality and timely delivery. Represent our brand throughout the project journey.",
      requirements: [
        "Bachelor's degree in Engineering or related field",
        "7+ years of project management experience",
        "PMP certification required",
        "Experience with government contracts"
      ]
    },
    {
      id: 3,
      title: "Construction Supervisor",
      department: "Construction",
      location: "Al Ain, UAE",
      type: "Full-time",
      experience: "3+ years",
      postingDate: "07/04/2025",
      description: "Supervise on-site construction activities and ensure compliance with safety and quality standards. This function is to ensure exceptional project execution.",
      requirements: [
        "Diploma in Construction or related field",
        "3+ years of construction supervision experience",
        "Knowledge of safety regulations",
        "Strong problem-solving skills"
      ]
    },
    {
      id: 4,
      title: "Quality Control Engineer",
      department: "Quality Assurance",
      location: "Dubai, UAE",
      type: "Full-time",
      experience: "4+ years",
      postingDate: "07/04/2025",
      description: "Ensure all construction work meets quality standards and regulatory requirements. Deliver a flawless project experience from start to finish.",
      requirements: [
        "Bachelor's degree in Engineering",
        "4+ years of quality control experience",
        "Knowledge of construction standards",
        "Attention to detail and analytical skills"
      ]
    },
    {
      id: 5,
      title: "Safety Officer",
      department: "Health & Safety",
      location: "Abu Dhabi, UAE",
      type: "Full-time",
      experience: "3+ years",
      postingDate: "07/04/2025",
      description: "Implement and monitor safety protocols across all construction sites to ensure worker safety. This function is to ensure exceptional safety standards in a highly empowered environment.",
      requirements: [
        "Bachelor's degree in Safety Engineering or related field",
        "3+ years of safety management experience",
        "NEBOSH certification preferred",
        "Knowledge of safety regulations"
      ]
    }
  ];

  const handleJobClick = (jobId: number) => {
    navigate(`/job-details/${jobId}`);
  };

  // Filter and sort jobs based on current filters
  const filteredAndSortedJobs = React.useMemo(() => {
    let filtered = jobListings;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }
    
    // Sort by posting date
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.postingDate.split('/').reverse().join('-'));
      const dateB = new Date(b.postingDate.split('/').reverse().join('-'));
      
      return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
    
    return sorted;
  }, [searchTerm, selectedLocation, sortOrder]);

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1280px] flex flex-col">
        {/* Header/Navigation */}
        <header className="w-full h-[91px] bg-white relative">
          <div className="flex w-[831px] items-center justify-between absolute top-7 left-[406px]">
            <nav className="flex w-[454px] items-center justify-center gap-[34px] relative">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`inline-flex items-center justify-center gap-2.5 relative flex-[0_0_auto] ${
                    index === 0
                      ? "ml-[-96.50px]"
                      : index === 1
                        ? "ml-[-12.50px]"
                        : index === 5
                          ? "mr-[-96.50px]"
                          : ""
                  }`}
                >
                  <span className="relative w-fit mt-[-1.00px] [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#656565] text-[18.7px] tracking-[0] leading-[normal] whitespace-nowrap hover:text-[#151d61] transition-colors">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="inline-flex items-center gap-[29px] relative flex-[0_0_auto] ml-[60px]">
              <Button
                variant="outline"
                className="flex flex-col w-[104px] h-[39px] items-center justify-center gap-2.5 px-[5px] py-[3px] relative rounded-[9px] border border-solid border-[#151d61] bg-transparent hover:bg-[#151d61] hover:text-white transition-colors"
              >
                <div className="inline-flex items-center gap-[5px] relative flex-[0_0_auto]">
                  <img
                    className="w-[23px] h-[23px]"
                    alt="Log in"
                    src="/log-in.svg"
                  />
                  <span className="relative w-fit mt-[-1.00px] [font-family:'Tajawal_Black-Regular',Helvetica] font-normal text-[#151d61] text-[19.7px] tracking-[0] leading-[normal]">
                    Sign in
                  </span>
                </div>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col w-[104px] h-[39px] items-center justify-center gap-2.5 px-[5px] py-[3px] relative rounded-[9px] border border-solid border-[#ce363a] bg-transparent hover:bg-[#ce363a] hover:text-white transition-colors"
              >
                <div className="inline-flex items-center gap-[5px] relative flex-[0_0_auto]">
                  <img
                    className="w-[21.69px] h-[21.69px]"
                    alt="Language"
                    src="/language.svg"
                  />
                  <span className="relative w-fit mt-[-1.00px] [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#ce363a] text-[18.7px] text-left tracking-[0] leading-[normal] whitespace-nowrap [direction:rtl]">
                    العربيــة
                  </span>
                </div>
              </Button>
            </div>
          </div>

          {/* Company Logo */}
          <img
            className="absolute w-[150px] h-[68px] top-3.5 left-[103px]"
            alt="EL RACE Logo"
            src="/pre-comp-2-1.svg"
          />
        </header>

        {/* Page Header */}
        <section className="relative h-48 w-full">
          <div className="h-48 bg-[url(/rectangle-1.svg)] bg-cover bg-[50%_50%] absolute w-full">
            <div className="h-48 bg-[linear-gradient(90deg,rgba(0,7,69,0.8)_45%,rgba(84,93,179,0.8)_100%)] absolute w-full">
              <div className="absolute top-6 left-[103px]">
                <Link 
                  to="/search-careers"
                  className="flex items-center gap-3 text-white hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                  <span className="[font-family:'Tajawal',Helvetica] font-normal text-[18px]">
                    Back to Search
                  </span>
                </Link>
              </div>
              
              <h1 className="absolute top-[60px] left-1/2 transform -translate-x-1/2 [font-family:'Times_New_Roman-Regular',Helvetica] font-normal text-white text-[36px] tracking-[0] leading-normal text-center">
                EXPLORE OPPORTUNITIES
              </h1>

              <p className="absolute w-[800px] top-[110px] left-1/2 transform -translate-x-1/2 [font-family:'Tajawal',Helvetica] font-normal text-white text-[16px] text-center tracking-[0] leading-normal">
                Join our team of dedicated professionals and be part of Egypt's leading construction company
              </p>
            </div>
            <div className="h-[17px] bottom-0 absolute w-full bg-[#9e3442]" />
          </div>
        </section>

        {/* Main content area */}
        <main className="w-full flex flex-col">
          {/* Search Filter Section */}
          <div className="w-full max-w-[819px] mx-auto mt-8">
            <Card className="flex h-[138px] rounded-[9px] border-2 border-[#6b6b6b] overflow-hidden">
              {/* Left section - Job title search */}
              <div className="flex-1 flex flex-col justify-center px-[35px]">
                <div className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#6b6b6b] text-[20.1px] tracking-[0]">
                  FIND JOBS
                </div>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-2 border-none p-0 h-auto shadow-none [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-black text-[25.9px] tracking-[0] placeholder:text-black focus-visible:ring-0"
                  placeholder="Job title, skill, keyword"
                />
              </div>

              {/* Vertical separator */}
              <Separator orientation="vertical" className="h-[62px] my-auto" />

              {/* Right section - Location search */}
              <div className="flex-1 flex flex-col justify-center px-[35px]">
                <div className="flex items-center justify-between">
                  <div className="[font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[#6b6b6b] text-[20.1px] tracking-[0]">
                    NEAR LOCATIONS
                  </div>
                  <ChevronDownIcon className="w-[12.99px] h-[11.25px] text-[#6b6b6b]" />
                </div>
                <Select>
                  <SelectTrigger className="mt-2 border-none p-0 h-auto shadow-none [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-black text-[25.9px] tracking-[0] focus-visible:ring-0 bg-transparent">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abu-dhabi">Abu Dhabi</SelectItem>
                    <SelectItem value="dubai">Dubai</SelectItem>
                    <SelectItem value="al-ain">Al Ain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search button */}
              <Button
                onClick={() => {
                  // Search functionality is handled by the state changes above
                  console.log('Search triggered with:', { searchTerm, selectedLocation });
                }}
                className="w-[156px] h-full rounded-none rounded-r-[9px] bg-[#e6e6e6] hover:bg-[#d9d9d9] border-l-2 border-[#6b6b6b]"
                variant="ghost"
              >
                <SearchIcon className="w-[38px] h-[38px] text-black" />
              </Button>
            </Card>
          </div>

          {/* Filter controls */}
          <div className="flex items-center gap-[19.29px] ml-auto mr-[103px] mt-8 relative">
            <button
              onClick={handleSortToggle}
              className="flex items-end gap-[10.39px] hover:opacity-80 transition-opacity"
            >
              <div className="[font-family:'Inter',Helvetica] font-normal text-[#4d4d4d] text-[17.8px]">
                Posting Date {sortOrder === 'desc' ? '(Newest First)' : '(Oldest First)'}
              </div>
              {sortOrder === 'desc' ? (
                <ArrowDownIcon className="w-[10.93px] h-[18.55px] text-[#4d4d4d]" />
              ) : (
                <ArrowUpIcon className="w-[10.93px] h-[18.55px] text-[#4d4d4d]" />
              )}
            </button>

            <div className="h-[40.07px] rounded-[8.91px] border-[1.48px] border-solid border-[#a4a4a4] flex">
              <button
                onClick={() => setViewMode('list')}
                className={`w-[67px] h-10 rounded-[8.91px_0px_0px_8.91px] flex items-center justify-center transition-colors ${
                  viewMode === 'list' ? 'bg-[#a4a4a4]' : 'bg-transparent hover:bg-gray-100'
                }`}
              >
                <ListIcon className="w-[21px] h-[21px]" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`w-[67px] h-10 flex items-center justify-center transition-colors ${
                  viewMode === 'map' ? 'bg-[#a4a4a4]' : 'bg-transparent hover:bg-gray-100'
                }`}
              >
                <MapPinIcon className="w-[21px] h-[21px]" />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="ml-[103px] mt-4">
            <p className="[font-family:'Inter',Helvetica] font-normal text-[#4d4d4d] text-[16px]">
              Showing {filteredAndSortedJobs.length} of {jobListings.length} jobs
            </p>
          </div>

          {/* Job Details Section */}
          <section className="flex flex-col w-full max-w-[1056px] items-start gap-7 mx-auto mt-8 px-[103px]">
            {filteredAndSortedJobs.length > 0 ? (
              filteredAndSortedJobs.map((job, index) => (
                <button
                  key={index}
                  onClick={() => handleJobClick(job.id)}
                  className="w-full h-[220px] bg-[#cfcfcf] border-none rounded-lg p-6 text-left hover:bg-[#c5c5c5] transition-colors cursor-pointer"
                >
                  <div className="w-full h-full">
                    <div className="w-full [font-family:'Arimo_Hebrew_Subset-Bold',Helvetica]">
                      <h3 className="font-bold text-black text-[24.2px]">
                        {job.title}
                      </h3>

                      <p className="[font-family:'Tajawal_Medium-Regular',Helvetica] text-[#2d2d2d]">
                        Location: {job.location}&nbsp;&nbsp;Posting Date: {job.postingDate}&nbsp;&nbsp;
                      </p>

                      <h4 className="[font-family:'Arimo',Helvetica] font-bold text-black text-[15px] mt-4">
                        ABOUT THE JOB
                      </h4>

                      <p className="[font-family:'Tajawal_Medium-Regular',Helvetica] text-black text-[15px]">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="w-full text-center py-16">
                <p className="[font-family:'Inter',Helvetica] font-normal text-[#4d4d4d] text-[18px]">
                  No jobs found matching your criteria. Try adjusting your search filters.
                </p>
              </div>
            )}
          </section>
        </main>

        {/* Call to Action Section */}
        <section className="bg-gray-50 px-[103px] py-16">
          <div className="text-center">
            <h2 className="[font-family:'Times_New_Roman-Regular',Helvetica] font-normal text-[#151d61] text-[32px] mb-4">
              Don't See the Right Position?
            </h2>
            <p className="[font-family:'Tajawal',Helvetica] text-[#656565] text-[18px] mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Button className="bg-[#ce363a] hover:bg-[#b8303a] text-white rounded-lg h-[50px] px-8 [font-family:'Tajawal',Helvetica] font-semibold text-[18px] transition-colors">
              Submit Your Resume
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#151d61] text-white px-[103px] py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img
                className="w-[120px] h-[54px] mb-4 brightness-0 invert"
                alt="EL RACE Logo"
                src="/pre-comp-2-1.svg"
              />
              <p className="[font-family:'Tajawal',Helvetica] text-[14px] text-gray-300 leading-relaxed">
                Building UAE's future with over 40 years of excellence in construction and infrastructure development.
              </p>
            </div>
            <div>
              <h3 className="[font-family:'Tajawal',Helvetica] font-semibold text-[18px] mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li><Link to="/" className="[font-family:'Tajawal',Helvetica] text-[14px] text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><a href="#" className="[font-family:'Tajawal',Helvetica] text-[14px] text-gray-300 hover:text-white transition-colors">Projects</a></li>
                <li><a href="#" className="[font-family:'Tajawal',Helvetica] text-[14px] text-gray-300 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="[font-family:'Tajawal',Helvetica] text-[14px] text-gray-300 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="[font-family:'Tajawal',Helvetica] font-semibold text-[18px] mb-4">
                Contact Info
              </h3>
              <div className="space-y-2 text-[14px] text-gray-300">
                <p className="[font-family:'Tajawal',Helvetica]">EL RACE UAE</p>
                <p className="[font-family:'Tajawal',Helvetica]">+20 2 1234 5678</p>
                <p className="[font-family:'Tajawal',Helvetica]">careers@elrace.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-8 text-center">
            <p className="[font-family:'Tajawal',Helvetica] text-[14px] text-gray-300">
              © 2024 EL RACE. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};