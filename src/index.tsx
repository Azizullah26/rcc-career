import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Careers } from "./screens/Careers";
import { ExploreOpportunities } from "./screens/ExploreOpportunities";
import { SearchCareers } from "./screens/SearchCareers";
import { JobDetails } from "./screens/JobDetails";
import { JobApplication } from "./screens/JobApplication";
import { ApplicationQuestions } from "./screens/ApplicationQuestions";
import { ExtendedApplicationQuestions } from "./screens/ExtendedApplicationQuestions";
import { AddExperience } from "./screens/AddExperience";
import { ApplicationSuccess } from "./screens/ApplicationSuccess";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Careers />} />
        <Route path="/explore-opportunities" element={<ExploreOpportunities />} />
        <Route path="/search-careers" element={<SearchCareers />} />
        <Route path="/job-details/:jobId" element={<JobDetails />} />
        <Route path="/job-application/:jobId" element={<JobApplication />} />
        <Route path="/application-questions/:jobId" element={<ApplicationQuestions />} />
        <Route path="/extended-application-questions/:jobId" element={<ExtendedApplicationQuestions />} />
        <Route path="/add-experience/:jobId" element={<AddExperience />} />
        <Route path="/application-success" element={<ApplicationSuccess />} />
      </Routes>
    </Router>
  </StrictMode>,
);
