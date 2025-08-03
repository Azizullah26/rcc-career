import { LogInIcon, ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

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

export const JobDetails = (): JSX.Element => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  // Navigation menu items
  const navItems = [
    { name: "HOME", href: "/" },
    { name: "PROJECTS", href: "#" },
    { name: "BLOGS", href: "#" },
    { name: "CONTACTS", href: "#" },
    { name: "SEARCH CAREERS", href: "/search-careers" },
    { name: "CAREERS", href: "/" },
  ];

  // Job data based on jobId
  const jobData = {
    1: {
      title: "Senior Civil Engineer",
      location: "Cairo, Egypt",
      department: "Engineering",
      type: "Full-time",
      experience: "5+ years",
      description: "Lead major infrastructure projects and manage engineering teams in delivering government contracts. This function is to ensure exceptional project delivery in a highly empowered environment.",
      requirements: [
        "Bachelor's degree in Civil Engineering",
        "5+ years of experience in construction projects",
        "Project management certification preferred",
        "Strong leadership and communication skills",
        "Experience with government contracts"
      ],
      responsibilities: [
        "Lead major infrastructure projects from conception to completion",
        "Manage and mentor engineering teams",
        "Ensure compliance with safety and quality standards",
        "Coordinate with government agencies and stakeholders"
      ]
    },
    2: {
      title: "Project Manager",
      location: "Alexandria, Egypt",
      department: "Operations",
      type: "Full-time",
      experience: "7+ years",
      description: "Oversee large-scale government projects from planning to completion, ensuring quality and timely delivery. Represent our brand throughout the project journey.",
      requirements: [
        "Bachelor's degree in Engineering or related field",
        "7+ years of project management experience",
        "PMP certification required",
        "Experience with government contracts",
        "Strong leadership and communication skills"
      ],
      responsibilities: [
        "Oversee large-scale government projects",
        "Ensure quality and timely delivery",
        "Manage project budgets and resources",
        "Coordinate with multiple stakeholders"
      ]
    },
    3: {
      title: "Construction Supervisor",
      location: "Giza, Egypt",
      department: "Construction",
      type: "Full-time",
      experience: "3+ years",
      description: "Supervise on-site construction activities and ensure compliance with safety and quality standards. This function is to ensure exceptional project execution.",
      requirements: [
        "Diploma in Construction or related field",
        "3+ years of construction supervision experience",
        "Knowledge of safety regulations",
        "Strong problem-solving skills",
        "Ability to work in challenging environments"
      ],
      responsibilities: [
        "Supervise on-site construction activities",
        "Ensure compliance with safety standards",
        "Monitor quality control processes",
        "Coordinate with construction teams"
      ]
    },
    4: {
      title: "Quality Control Engineer",
      location: "Cairo, Egypt",
      department: "Quality Assurance",
      type: "Full-time",
      experience: "4+ years",
      description: "Ensure all construction work meets quality standards and regulatory requirements. Deliver a flawless project experience from start to finish.",
      requirements: [
        "Bachelor's degree in Engineering",
        "4+ years of quality control experience",
        "Knowledge of construction standards",
        "Attention to detail and analytical skills",
        "Experience with testing equipment"
      ],
      responsibilities: [
        "Ensure construction work meets quality standards",
        "Conduct regular quality inspections",
        "Prepare quality reports and documentation",
        "Coordinate with project teams on quality issues"
      ]
    },
    5: {
      title: "Safety Officer",
      location: "Cairo, Egypt",
      department: "Health & Safety",
      type: "Full-time",
      experience: "3+ years",
      description: "Implement and monitor safety protocols across all construction sites to ensure worker safety. This function is to ensure exceptional safety standards in a highly empowered environment.",
      requirements: [
        "Bachelor's degree in Safety Engineering or related field",
        "3+ years of safety management experience",
        "NEBOSH certification preferred",
        "Knowledge of safety regulations",
        "Strong communication and training skills"
      ],
      responsibilities: [
        "Implement and monitor safety protocols",
        "Conduct safety training sessions",
        "Investigate accidents and incidents",
        "Ensure compliance with safety regulations"
      ]
    }
  };

  const job = jobData[parseInt(jobId || '1') as keyof typeof jobData] || jobData[1];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1282px] relative min-h-[973px]">
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

        {/* Back Button */}
        <div className="absolute top-[100px] left-[85px]">
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

        {/* Job Title */}
        <h1 className="absolute top-[136px] left-0 right-0 mx-auto [font-family:'Inter',Helvetica] font-bold text-black text-[30.8px] text-center tracking-[0] leading-normal">
          {job.title}
          <br />
          {job.location}
        </h1>

        {/* Job Description */}
        <Card className="absolute w-[1084px] top-[248px] left-[85px] border-none shadow-none">
          <CardContent className="p-0 [font-family:'Inter',Helvetica] font-normal text-black text-[22.8px] text-justify tracking-[0] leading-normal">
            <h2 className="font-bold">Job Description</h2>

            <p className="font-light mb-6">
              <strong>ABOUT THE POSITION</strong>
              <br />
              {job.description}
            </p>

            <div className="mb-6">
              <p className="font-light">
                <strong>Department:</strong> {job.department} | <strong>Type:</strong> {job.type} | <strong>Experience:</strong> {job.experience}
              </p>
            </div>

            <h2 className="font-bold mt-4">WHAT YOU WILL NEED TO SUCCEED</h2>

            <ul className="list-disc pl-6 font-light mb-6">
              {job.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>

            <h2 className="font-bold mt-4">
              KEY RESPONSIBILITIES
            </h2>

            <ul className="list-disc pl-6 font-light mb-8">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>

            {/* Apply Button */}
            <div className="flex justify-center mt-8">
              <Button 
                onClick={() => navigate(`/job-application/${jobId}`)}
                className="w-[207px] h-[67px] bg-[#151d61] rounded-[16.04px] [font-family:'Tajawal',Helvetica] font-bold text-white text-[36.6px] hover:bg-[#1a2470] transition-colors"
              >
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};