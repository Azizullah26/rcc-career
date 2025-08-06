// Odoo API Service for Job Applications
export interface OdooConfig {
  url: string;
  database: string;
  username: string;
  password: string;
}

export interface JobApplicationData {
  // Personal Information
  partner_name: string; // Full Name
  email_from: string; // Email Address
  partner_phone: string; // Phone Number
  date_of_birth?: string; // Date of Birth
  nationality?: string; // Nationality
  gender?: string; // Gender
  marital_status?: string; // Marital Status
  
  // Job Related
  job_id: number; // Job Position ID in Odoo
  name: string; // Application Name/Subject
  description?: string; // Cover letter or additional info
  
  // Experience
  total_experience?: string; // Total Experience
  uae_experience?: string; // UAE Experience
  current_location?: string; // Current Location
  expected_salary?: string; // Expected Salary
  joining_possibility?: string; // Joining Possibility
  
  // Additional Info
  uae_driving_license?: boolean; // UAE Driving License
  relocation_possibility?: boolean; // Relocation Possibility
  languages?: string; // Languages (JSON string)
  
  // Application Questions
  previously_worked?: boolean; // Previously worked with company
  work_details?: string; // Work details
  relatives_friends?: boolean; // Relatives/Friends in company
  relative_names?: string; // Names of relatives/friends
  relationships?: string; // Relationship types
  
  // System fields
  stage_id?: number; // Application stage
  source_id?: number; // Source of application
}

export interface OdooResponse {
  success: boolean;
  data?: any;
  error?: string;
  applicant_id?: number;
}

class OdooService {
  private config: OdooConfig;
  private sessionId: string | null = null;

  constructor(config: OdooConfig) {
    this.config = config;
  }

  // Authenticate with Odoo
  async authenticate(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.url}/web/session/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            db: this.config.database,
            login: this.config.username,
            password: this.config.password,
          },
        }),
      });

      const data = await response.json();
      
      if (data.result && data.result.uid) {
        this.sessionId = data.result.session_id;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Odoo authentication failed:', error);
      return false;
    }
  }

  // Create job application in Odoo
  async createJobApplication(applicationData: JobApplicationData): Promise<OdooResponse> {
    try {
      // Ensure we're authenticated
      if (!this.sessionId) {
        const authenticated = await this.authenticate();
        if (!authenticated) {
          return { success: false, error: 'Authentication failed' };
        }
      }

      const response = await fetch(`${this.config.url}/web/dataset/call_kw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `session_id=${this.sessionId}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'hr.applicant',
            method: 'create',
            args: [applicationData],
            kwargs: {},
          },
        }),
      });

      const data = await response.json();
      
      if (data.result) {
        return { 
          success: true, 
          data: data.result,
          applicant_id: data.result 
        };
      } else {
        return { 
          success: false, 
          error: data.error?.message || 'Failed to create application' 
        };
      }
    } catch (error) {
      console.error('Failed to create job application:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Upload CV file to Odoo
  async uploadCV(applicantId: number, file: File): Promise<OdooResponse> {
    try {
      // Convert file to base64
      const base64File = await this.fileToBase64(file);
      
      const attachmentData = {
        name: file.name,
        datas: base64File,
        res_model: 'hr.applicant',
        res_id: applicantId,
        mimetype: file.type,
        description: 'CV/Resume',
      };

      const response = await fetch(`${this.config.url}/web/dataset/call_kw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `session_id=${this.sessionId}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'ir.attachment',
            method: 'create',
            args: [attachmentData],
            kwargs: {},
          },
        }),
      });

      const data = await response.json();
      
      if (data.result) {
        return { success: true, data: data.result };
      } else {
        return { 
          success: false, 
          error: data.error?.message || 'Failed to upload CV' 
        };
      }
    } catch (error) {
      console.error('Failed to upload CV:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Get job positions from Odoo
  async getJobPositions(): Promise<OdooResponse> {
    try {
      if (!this.sessionId) {
        const authenticated = await this.authenticate();
        if (!authenticated) {
          return { success: false, error: 'Authentication failed' };
        }
      }

      const response = await fetch(`${this.config.url}/web/dataset/call_kw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `session_id=${this.sessionId}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'hr.job',
            method: 'search_read',
            args: [
              [['state', '=', 'recruit']], // Only active job positions
              ['id', 'name', 'department_id', 'description']
            ],
            kwargs: {},
          },
        }),
      });

      const data = await response.json();
      
      if (data.result) {
        return { success: true, data: data.result };
      } else {
        return { 
          success: false, 
          error: data.error?.message || 'Failed to fetch job positions' 
        };
      }
    } catch (error) {
      console.error('Failed to fetch job positions:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Helper function to convert file to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data:mime/type;base64, prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  }
}

// Environment configuration
const odooConfig: OdooConfig = {
  url: process.env.NEXT_PUBLIC_ODOO_URL || 'https://your-odoo-instance.odoo.com',
  database: process.env.NEXT_PUBLIC_ODOO_DATABASE || 'your-database-name',
  username: process.env.NEXT_PUBLIC_ODOO_USERNAME || 'api-user',
  password: process.env.NEXT_PUBLIC_ODOO_PASSWORD || 'api-password',
};

export const odooService = new OdooService(odooConfig);