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
Copy all the provided files to the module directory:
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
Use Postman or curl to test:

\`\`\`bash
# Test job positions endpoint
curl -X GET "https://your-odoo-domain.com/api/career/jobs" \
  -H "Content-Type: application/json"

# Test application creation
curl -X POST "https://your-odoo-domain.com/api/career/apply" \
  -H "Content-Type: application/json" \
  -d '{"jobId": "1", "formData": {...}}'
\`\`\`

## Configuration

### Environment Variables
Set these in your Next.js application:
\`\`\`env
ODOO_URL=https://your-odoo-domain.com
ODOO_DB=your_database_name
ODOO_USER=api@rcc.ae
ODOO_PASSWORD=your_api_password
\`\`\`

### Security Settings
1. Enable CORS for your domain
2. Configure rate limiting if needed
3. Set up SSL certificates
4. Configure firewall rules

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration in Odoo
   - Verify domain whitelist

2. **Authentication Errors**
   - Verify API user credentials
   - Check user permissions

3. **Field Errors**
   - Ensure module is properly installed
   - Check field names match exactly

4. **File Upload Errors**
   - Check file size limits
   - Verify file type restrictions
   - Check disk space

### Logs Location
- Odoo logs: `/var/log/odoo/odoo-server.log`
- Application logs: Check your application logs

## Support

For technical support:
1. Check Odoo logs for detailed error messages
2. Verify all module dependencies are installed
3. Test API endpoints individually
4. Contact development team if issues persist

## Module Features

✅ Extended hr.applicant model with 20+ fields
✅ REST API endpoints for job applications
✅ CV file upload with validation
✅ Job positions API
✅ CORS support for web integration
✅ Comprehensive error handling
✅ Security validations
✅ UTM tracking integration
