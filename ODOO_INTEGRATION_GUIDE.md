# Odoo Integration Guide for Career Portal

## Overview
This document explains how the Career Portal integrates with Odoo to display job positions created by HR.

## Current Status
✅ **Integration is working!** Jobs created in Odoo are automatically displayed in the career portal at `/explore-opportunities`.

## Technical Details

### 1. Odoo Model Used
- **Model Name**: `hr.job`
- **Purpose**: Fetches job positions created by HR in Odoo

### 2. API Authentication
- **Method**: XML-RPC
- **Endpoint**: `${ODOO_URL}/xmlrpc/2/common` (authentication)
- **Endpoint**: `${ODOO_URL}/xmlrpc/2/object` (data operations)
- **Credentials Required**:
  - `ODOO_URL`: Your Odoo instance URL
  - `ODOO_DB`: Database name
  - `ODOO_USERNAME`: API user username
  - `ODOO_PASSWORD`: API user password (stored as environment variable)

### 3. Fields Being Accessed

The career portal reads the following fields from `hr.job`:

| Odoo Field | Frontend Field | Description |
|------------|---------------|-------------|
| `id` | `id` | Job ID (used for reference) |
| `name` | `title` | Job title/position name |
| `department_id` | `department` | Department name |
| `address_id` | `location` | Job location |
| `employment_type` | `type` | Employment type (Full-time, Part-time, etc.) |
| `experience` | `experience` | Required experience |
| `create_date` | `postingDate` | Date job was created |
| `description` | `description` | Job description |
| `requirements` | `requirements` | Job requirements (array) |
| `state` | - | Job state (only 'recruit' state jobs are shown) |

### 4. Search Criteria

The API fetches jobs with the following criteria:
\`\`\`javascript
[['state', '=', 'recruit']]  // Only active recruiting positions
\`\`\`

### 5. Reference Number Generation

The career portal automatically generates reference numbers for jobs:
- Format: `RCC1001`, `RCC1002`, `RCC1003`, etc.
- Sequential numbering based on job order
- These reference numbers are used for tracking applications

### 6. Required Permissions

The Odoo API user needs the following permissions:
- **Read access** to `hr.job` model
- **Read access** to `hr.department` model (for department names)
- **Read access** to `res.partner` model (for location/address)
- **Create access** to `hr.applicant` model (for job applications)
- **Create access** to `ir.attachment` model (for CV uploads)

### 7. Custom Fields (Optional)

If you want to add more fields to the job listing, you can add these custom fields to the `hr.job` model in Odoo:

#### Recommended Custom Fields:
1. **x_reference_number** (Char)
   - Purpose: Store custom reference number (e.g., RCC1001)
   - If this field exists, the portal will use it instead of generating one

2. **x_requirements** (Text/HTML)
   - Purpose: Structured job requirements
   - Format: Comma-separated or JSON array

3. **x_experience_years** (Integer)
   - Purpose: Minimum years of experience required

4. **x_salary_range** (Char)
   - Purpose: Salary range for the position

5. **x_benefits** (Text)
   - Purpose: Job benefits and perks

### 8. How It Works

1. **HR creates a job in Odoo**
   - Go to Recruitment → Job Positions
   - Create a new job position
   - Set state to "Recruitment in Progress"

2. **Career portal fetches jobs**
   - API endpoint: `/api/odoo/jobs`
   - Automatically fetches all jobs with `state = 'recruit'`
   - Updates every time the page is loaded

3. **Jobs appear in career portal**
   - Displayed at `/explore-opportunities`
   - Users can search and filter jobs
   - Clicking a job shows details and application form

4. **Applications are sent back to Odoo**
   - Creates `hr.applicant` record
   - Attaches CV as `ir.attachment`
   - Links to the job position

### 9. Testing the Integration

To verify the integration is working:

1. **Create a test job in Odoo**:
   \`\`\`
   Name: Test Position
   Department: IT
   State: Recruitment in Progress
   \`\`\`

2. **Check the career portal**:
   - Visit `/explore-opportunities`
   - The test job should appear in the list

3. **Check the API directly**:
   - Visit `/api/odoo/jobs`
   - Should return JSON with all active jobs

### 10. Troubleshooting

#### Jobs not appearing?
- Check job state is set to "Recruitment in Progress" (`state = 'recruit'`)
- Verify API credentials are correct
- Check Odoo user has read permissions on `hr.job`

#### Applications not being received?
- Verify API user has create permissions on `hr.applicant`
- Check `ir.attachment` permissions for CV uploads
- Review server logs for error messages

### 11. Environment Variables

Ensure these are set in your deployment:

\`\`\`env
ODOO_URL=https://your-odoo-instance.com
ODOO_DB=your_database_name
ODOO_USERNAME=api_user
ODOO_PASSWORD=secure_password
\`\`\`

### 12. API Response Format

The `/api/odoo/jobs` endpoint returns:

\`\`\`json
{
  "success": true,
  "jobs": [
    {
      "id": 149,
      "referenceNumber": "RCC1001",
      "title": "Senior Civil Engineer",
      "department": "Engineering",
      "location": "UAE",
      "type": "Full-time",
      "experience": "5+ years",
      "postingDate": "15/06/2025",
      "description": "Job description here...",
      "requirements": ["Requirement 1", "Requirement 2"]
    }
  ]
}
\`\`\`

## Summary for Odoo Developer

**What you need to do:**
1. ✅ Ensure `hr.job` model is accessible via XML-RPC API
2. ✅ Create an API user with appropriate permissions
3. ✅ Set job state to "Recruitment in Progress" for jobs to appear
4. ✅ (Optional) Add custom fields for enhanced job information

**What's already working:**
- Jobs are automatically fetched from Odoo
- Applications are sent back to Odoo with CV attachments
- Reference numbers are generated automatically

**No changes needed in Odoo** unless you want to add custom fields for additional job information.
