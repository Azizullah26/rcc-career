import { useState } from 'react';

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  nationality: string;
  gender: string;
  maritalStatus: string;
  totalExperience: string;
  uaeExperience: string;
  currentLocation: string;
  expectedSalary: string;
  joiningPossibility: string;
  uaeDrivingLicense: string;
  relocationPossibility: string;
  languages: Array<{ id: number; language: string; proficiency: string }>;
  previouslyWorked: string;
  workDetails: string;
  relativesOrFriends: string;
  names: string;
  selectedRelationships: string[];
  experienceData: Record<string, string>;
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
      // Build multipart form-data for server endpoint
      const form = new FormData();
      form.append('data', JSON.stringify({ jobId, formData }));
      if (cvFile) {
        form.append('cv', cvFile, cvFile.name);
      }

      const res = await fetch('/api/odoo/apply', {
        method: 'POST',
        body: form,
      });

      const json = await res.json();

      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Failed to submit application');
      }

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Application submission failed:', error);
      setSubmitError(message);
      return { success: false, error: message };
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
