import { SearchIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
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

// Main Component
export const SearchCareers = (): JSX.Element => {
  // Navigation menu items
  const navItems = [
    { label: "HOME", href: "/" },
    { label: "PROJECTS", href: "#" },
    { label: "BLOGS", href: "#" },
    { label: "CONTACTS", href: "#" },
    { label: "SEARCH CAREERS", href: "/search-careers", active: true },
    { label: "CAREERS", href: "/" },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-[1280px] relative">
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
                  <span className={`relative w-fit mt-[-1.00px] [font-family:'Tajawal_Medium-Regular',Helvetica] font-normal text-[18.7px] tracking-[0] leading-[normal] whitespace-nowrap ${
                    item.active ? "text-[#151d61]" : "text-[#656565] hover:text-[#151d61]"
                  } transition-colors`}>
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

        {/* Main Content */}
        <main className="w-[1052px] mx-auto mt-[115px]">
          {/* Banner Image Section */}
          <section className="flex flex-col w-full items-center gap-[13.66px] mb-[60px]">
            <div className="relative w-full h-[326.26px] bg-[url(/image.png)] bg-cover bg-center rounded-lg overflow-hidden">
              <div className="h-full bg-[linear-gradient(90deg,rgba(0,7,69,0.8)_45%,rgba(84,93,179,0.8)_100%)] flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="[font-family:'Times_New_Roman-Regular',Helvetica] font-normal text-[42px] mb-4">
                    SEARCH CAREERS
                  </h1>
                  <p className="[font-family:'Tajawal',Helvetica] font-normal text-[18px] max-w-2xl">
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
          <section className="w-full text-justify [font-family:'Tajawal',Helvetica] font-normal text-[#494949] text-[21.3px] tracking-[0] leading-[normal] mb-[60px]">
            <p>
              Since 1985, EL RACE Contracting has been on a continuous journey
              of success and achievement, built on a steadfast commitment to
              hard work and pure intentions.
            </p>
            <br />
            <p>
              Over the past four decades, much has changed. Our tools have
              evolved, our cities have expanded, and our ambitions have grown.
              But what has never changed is our unwavering belief in our core
              values: professionalism, integrity, transparency, and
              sustainability.
            </p>
            <br />
            <p>
              We believe that true success is only achieved through a motivating
              work environment, where every individual finds their place to
              contribute to building projects that serve communities and create
              a better future for our nation.
              <br />
              <strong>We're Looking for You!</strong>
            </p>
            <br />
            <p>
              If you have a passion for excellence, the ambition to face
              challenges, and you share our values of innovation and social
              responsibility, we invite you to be a part of our team.
              <br />
              Join us today, and add your mark to a continuous story of success.
            </p>
          </section>

          {/* Job Search Section */}
          <Card className="w-[813px] h-[138px] mx-auto rounded-[9px] border-2 border-solid border-[#6b6b6b] flex overflow-hidden">
            <div className="flex-1 flex items-center">
              <div className="flex flex-col px-[35px] py-[35px] flex-1">
                <span className="[font-family:'Tajawal',Helvetica] font-normal text-[#6b6b6b] text-[20.1px] text-center">
                  FIND JOBS
                </span>
                <span className="[font-family:'Tajawal',Helvetica] font-normal text-black text-[25.9px] text-center mt-[12px]">
                  Job title
                </span>
              </div>

              <Separator
                orientation="vertical"
                className="h-[62px] w-0.5 bg-[#6b6b6b]"
              />

              <div className="flex flex-col px-[35px] py-[35px] flex-1">
                <div className="flex items-center justify-between">
                  <span className="[font-family:'Tajawal',Helvetica] font-normal text-[#6b6b6b] text-[20.1px] text-center">
                    NEAR LOCATIONS
                  </span>
                  <svg
                    className="w-[12.99px] h-[11.25px]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>
                <span className="[font-family:'Tajawal',Helvetica] font-normal text-black text-[25.9px] text-center mt-[15px]">
                  City
                </span>
              </div>
            </div>

            <Link to="/explore-opportunities" className="w-[156px] h-full">
              <Button className="w-full h-full rounded-[0px_9px_9px_0px] bg-[#e6e6e6] border-l-2 border-solid border-[#6b6b6b] flex items-center justify-center hover:bg-[#d6d6d6] transition-colors">
                <SearchIcon className="w-[38px] h-[38px] text-black" />
              </Button>
            </Link>
          </Card>

          {/* Navigation to Explore Opportunities */}
          <div className="flex justify-center mt-[60px] mb-[60px]">
            <Link to="/explore-opportunities">
              <Button className="bg-[#151d61] hover:bg-[#1a2470] text-white rounded-lg h-[50px] px-8 [font-family:'Tajawal',Helvetica] font-semibold text-[18px] transition-colors">
                View All Opportunities
              </Button>
            </Link>
          </div>
        </main>

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