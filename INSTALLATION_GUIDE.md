# RCC Career Portal - Odoo Module Installation Guide

## Prerequisites

1. Odoo 15.0 or higher
2. hr_recruitment module installed
3. website module installed
4. Admin access to Odoo

## Installation Steps

### 1. Create Module Directory
\`\`\`bash
mkdir -p /path/to/odoo/addons/rcc_career_portal
\`\`\`

### 2. Copy Module Files
Copy all the provided files to the module directory maintaining the folder structure:
- `__init__.py`
- `__manifest__.py`
- `controllers/` folder with files
- `models/` folder with files
- `security/` folder with files
- `views/` folder with files
- `data/` folder with files

### 3. Update Odoo Apps List
1. Go to Apps menu in Odoo
2. Click "Update Apps List"
3. Search for "RCC Career Portal Integration"
4. Click Install

### 4. Configure API User (Recommended)
Create a dedicated API user for security:
1. Go to Settings > Users & Companies > Users
2. Create new user with email: `api@rcc.ae`
3. Set groups: HR Officer, Website Publisher
4. Generate API key or use password

### 5. Test API Endpoints
Use the provided test scripts to verify installation

## Environment Variables

Set these in your Next.js application:
\`\`\`env
ODOO_URL=https://your-odoo-domain.com
ODOO_DB=your_database_name
ODOO_USER=api@rcc.ae
ODOO_PASSWORD=your_api_password
\`\`\`

## API Endpoints Created

- `POST /api/career/apply` - Create job application
- `POST /api/career/upload_cv` - Upload CV file
- `GET /api/career/jobs` - Get active job positions

## Database Fields Added

The module extends hr.applicant model with 20+ new fields for comprehensive job application data including:
- Personal information (nationality, gender, marital status)
- Experience details (UAE experience, expected salary)
- Additional info (driving license, languages)
- Application questions (previous work, relatives)
- Experience data with currently working status

## Support

For technical support:
1. Check Odoo logs for detailed error messages
2. Verify all module dependencies are installed
3. Test API endpoints individually
4. Contact development team if issues persist
