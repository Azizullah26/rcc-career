import { useState } from 'react';
import { odooService, JobApplicationData, OdooResponse } from '../services/odooService';

export interface ApplicationFormData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  nationality: string;
  gender: string;
  maritalStatus: string;
  
  // Experience
  totalExperience: string;
  egyptExperience: string;
  currentLocation: string;
  expectedSalary: string;
  joiningPossibility: string;
  
  // Additional Info
  egyptDrivingLicense: string;
  relocationPossibility: string;
  firstLanguage: string;
  secondLanguage: string;
  
  // Application Questions
  previouslyWorked: string;
  workDetails: string;
  relativesOrFriends: string;
  names: string;
  selectedRelationships: string[];
}

export const useJobApplication = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitApplication = async (
    jobId: string,
    formData: ApplicationFormData,
    cvFile: File | null
  ): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Map form data to Odoo format
      const odooData: JobApplicationData = {
        // Personal Information
        partner_name: formData.fullName,
        email_from: formData.email,
        partner_phone: formData.phone,
        date_of_birth: formData.dob,
        nationality: formData.nationality,
        gender: formData.gender,
        marital_status: formData.maritalStatus,
        
        // Job Related
        job_id: parseInt(jobId),
        name: `Application for Job ID: ${jobId} - ${formData.fullName}`,
        description: `Application submitted through career portal`,
        
        // Experience
        total_experience: formData.totalExperience,
        uae_experience: formData.egyptExperience,
        current_location: formData.currentLocation,
        expected_salary: formData.expectedSalary,
        joining_possibility: formData.joiningPossibility,
        
        // Additional Info
        uae_driving_license: formData.egyptDrivingLicense === 'yes',
        relocation_possibility: formData.relocationPossibility === 'yes',
        languages: JSON.stringify({
          first: formData.firstLanguage,
          second: formData.secondLanguage
        }),
        
        // Application Questions
        previously_worked: formData.previouslyWorked === 'yes',
        work_details: formData.workDetails,
        relatives_friends: formData.relativesOrFriends === 'yes',
        relative_names: formData.names,
        relationships: JSON.stringify(formData.selectedRelationships),
        
        // System fields
        stage_id: 1, // Initial stage - to be configured in Odoo
        source_id: 1, // Website source - to be configured in Odoo
      };

      // Create job application
      const applicationResult = await odooService.createJobApplication(odooData);
      
      if (!applicationResult.success) {
        throw new Error(applicationResult.error || 'Failed to create application');
      }

      // Upload CV if provided
      if (cvFile && applicationResult.applicant_id) {
        const cvResult = await odooService.uploadCV(applicationResult.applicant_id, cvFile);
        
        if (!cvResult.success) {
          console.warn('CV upload failed:', cvResult.error);
          // Don't fail the entire application if CV upload fails
        }
      }

      return { success: true };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSubmitError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitApplication,
    isSubmitting,
    submitError,
  };
};