# RCC Career Portal - API Testing Guide

## Prerequisites for Testing

1. Odoo module `rcc_career_portal` installed and activated
2. At least one active job position in HR > Recruitment > Job Positions
3. API testing tool (Postman, curl, or similar)
4. Odoo instance accessible via HTTPS

## Test Environment Setup

### 1. Create Test Job Position
\`\`\`sql
-- Execute in Odoo database or create via UI
INSERT INTO hr_job (name, state, website_published, no_of_recruitment) 
VALUES ('Software Developer', 'recruit', true, 1);
\`\`\`

### 2. Get Job ID
\`\`\`bash
# Note the job ID from the response - you'll need it for testing
curl -X GET "https://your-odoo-domain.com/api/career/jobs" \
  -H "Content-Type: application/json"
\`\`\`

## API Endpoint Tests

### Test 1: Get Job Positions
**Endpoint:** `GET /api/career/jobs`

\`\`\`bash
curl -X GET "https://your-odoo-domain.com/api/career/jobs" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "jobs": [
    {
      "id": 1,
      "name": "Software Developer",
      "department": "IT",
      "location": "Dubai",
      "description": "Job description here",
      "requirements": "Job requirements here",
      "expected_employees": 1,
      "no_of_recruitment": 1
    }
  ],
  "count": 1
}
\`\`\`

**Validation Checklist:**
- [ ] Response status is 200
- [ ] `success` field is `true`
- [ ] `jobs` array contains job data
- [ ] `count` matches number of jobs
- [ ] All job fields are present

### Test 2: Submit Job Application
**Endpoint:** `POST /api/career/apply`

\`\`\`bash
curl -X POST "https://your-odoo-domain.com/api/career/apply" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "1",
    "formData": {
      "firstName": "Ahmed",
      "lastName": "Al-Rashid",
      "email": "ahmed.test@example.com",
      "phone": "+971501234567",
      "dateOfBirth": "1990-05-15",
      "nationality": "Emirati",
      "gender": "male",
      "maritalStatus": "single",
      "totalExperience": "5 years",
      "uaeExperience": "3 years",
      "currentLocation": "Dubai",
      "expectedSalary": "12000 AED",
      "joiningPossibility": "1 month notice",
      "uaeDrivingLicense": true,
      "relocationPossibility": false,
      "languages": [
        {"language": "Arabic", "proficiency": "Native"},
        {"language": "English", "proficiency": "Fluent"}
      ],
      "previouslyWorked": false,
      "workDetails": "",
      "relativesOrFriends": false,
      "relativeNames": "",
      "relationships": [],
      "experienceData": [
        {
          "company": "Tech Solutions LLC",
          "position": "Senior Developer",
          "duration": "2020-2023",
          "responsibilities": "Led development team, built web applications"
        }
      ]
    }
  }'
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "applicant_id": 123,
  "message": "Application submitted successfully"
}
\`\`\`

**Validation Checklist:**
- [ ] Response status is 200
- [ ] `success` field is `true`
- [ ] `applicant_id` is returned
- [ ] New record created in `hr.applicant` table
- [ ] All custom fields populated correctly

### Test 3: Upload CV File
**Endpoint:** `POST /api/career/upload_cv`

\`\`\`bash
curl -X POST "https://your-odoo-domain.com/api/career/upload_cv" \
  -H "Accept: application/json" \
  -F "applicant_id=123" \
  -F "cv_file=@/path/to/test_cv.pdf"
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "attachment_id": 456,
  "message": "CV uploaded successfully"
}
\`\`\`

**Validation Checklist:**
- [ ] Response status is 200
- [ ] `success` field is `true`
- [ ] `attachment_id` is returned
- [ ] File attached to applicant record
- [ ] File accessible in Odoo interface

## Error Scenario Tests

### Test 4: Invalid Job ID
\`\`\`bash
curl -X POST "https://your-odoo-domain.com/api/career/apply" \
  -H "Content-Type: application/json" \
  -d '{"jobId": "999", "formData": {"firstName": "Test"}}'
\`\`\`

**Expected Response:**
\`\`\`json
{
  "error": "Job position not found",
  "success": false
}
\`\`\`

### Test 5: Missing Required Fields
\`\`\`bash
curl -X POST "https://your-odoo-domain.com/api/career/apply" \
  -H "Content-Type: application/json" \
  -d '{"jobId": "1"}'
\`\`\`

**Expected Response:**
\`\`\`json
{
  "error": "Missing required data",
  "success": false
}
\`\`\`

### Test 6: Invalid File Type
\`\`\`bash
curl -X POST "https://your-odoo-domain.com/api/career/upload_cv" \
  -F "applicant_id=123" \
  -F "cv_file=@/path/to/test.txt"
\`\`\`

**Expected Response:**
\`\`\`json
{
  "error": "Invalid file type. Only PDF and Word documents are allowed.",
  "success": false
}
\`\`\`

### Test 7: File Too Large
\`\`\`bash
# Upload file larger than 5MB
curl -X POST "https://your-odoo-domain.com/api/career/upload_cv" \
  -F "applicant_id=123" \
  -F "cv_file=@/path/to/large_file.pdf"
\`\`\`

**Expected Response:**
\`\`\`json
{
  "error": "File too large. Maximum size is 5MB.",
  "success": false
}
\`\`\`

## Database Verification

### Check Applicant Record
\`\`\`sql
-- Verify applicant was created with all fields
SELECT 
    id, name, email_from, partner_phone, job_id,
    x_nationality, x_gender, x_marital_status,
    x_total_experience, x_uae_experience,
    x_expected_salary, x_languages,
    x_experience_data, x_source_website
FROM hr_applicant 
WHERE email_from = 'ahmed.test@example.com';
\`\`\`

### Check Attachment Record
\`\`\`sql
-- Verify CV file was attached
SELECT 
    id, name, res_model, res_id, mimetype, 
    description, create_date
FROM ir_attachment 
WHERE res_model = 'hr.applicant' 
AND res_id = 123;
\`\`\`

## Performance Tests

### Test 8: Concurrent Applications
\`\`\`bash
# Run multiple applications simultaneously
for i in {1..10}; do
  curl -X POST "https://your-odoo-domain.com/api/career/apply" \
    -H "Content-Type: application/json" \
    -d "{\"jobId\": \"1\", \"formData\": {\"firstName\": \"Test$i\", \"lastName\": \"User\", \"email\": \"test$i@example.com\"}}" &
done
wait
\`\`\`

### Test 9: Large File Upload
\`\`\`bash
# Test with maximum allowed file size (5MB)
curl -X POST "https://your-odoo-domain.com/api/career/upload_cv" \
  -F "applicant_id=123" \
  -F "cv_file=@/path/to/5mb_file.pdf" \
  --max-time 30
\`\`\`

## CORS Testing

### Test 10: Cross-Origin Request
\`\`\`javascript
// Test from browser console on different domain
fetch('https://your-odoo-domain.com/api/career/jobs', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
\`\`\`

## Security Tests

### Test 11: SQL Injection Attempt
\`\`\`bash
curl -X POST "https://your-odoo-domain.com/api/career/apply" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "1; DROP TABLE hr_applicant; --",
    "formData": {"firstName": "Test"}
  }'
\`\`\`

**Expected:** Should be handled safely without SQL injection

### Test 12: XSS Attempt
\`\`\`bash
curl -X POST "https://your-odoo-domain.com/api/career/apply" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "1",
    "formData": {
      "firstName": "<script>alert(\"XSS\")</script>",
      "email": "test@example.com"
    }
  }'
\`\`\`

**Expected:** Script tags should be escaped/sanitized

## Monitoring and Logs

### Check Odoo Logs
\`\`\`bash
# Monitor logs during testing
tail -f /var/log/odoo/odoo-server.log | grep -i "career\|applicant"
\`\`\`

### Expected Log Entries
\`\`\`
INFO: Created job application with ID: 123 for job: Software Developer
INFO: Uploaded CV for applicant 123, attachment ID: 456
ERROR: Validation error creating job application: Missing required field
\`\`\`

## Final Validation Checklist

After running all tests, verify:

- [ ] All API endpoints respond correctly
- [ ] Database records created with proper data
- [ ] File uploads work and files are accessible
- [ ] Error handling works for invalid inputs
- [ ] CORS headers allow cross-origin requests
- [ ] Security measures prevent injection attacks
- [ ] Performance is acceptable under load
- [ ] Logs show appropriate information
- [ ] UTM source tracking works
- [ ] All custom fields are populated

## Troubleshooting Common Issues

### Issue: CORS Errors
**Solution:** Check Odoo CORS configuration and ensure domain is whitelisted

### Issue: 404 Not Found
**Solution:** Verify module is installed and routes are registered

### Issue: 500 Internal Server Error
**Solution:** Check Odoo logs for detailed error messages

### Issue: Database Connection Errors
**Solution:** Verify database credentials and connection

### Issue: File Upload Fails
**Solution:** Check file permissions and disk space

## Test Report Template

\`\`\`
# API Testing Report - RCC Career Portal

**Date:** [Date]
**Tester:** [Name]
**Odoo Version:** [Version]
**Module Version:** [Version]

## Test Results Summary
- Total Tests: 12
- Passed: [X]
- Failed: [X]
- Skipped: [X]

## Detailed Results
[List each test with PASS/FAIL status and notes]

## Issues Found
[List any issues discovered during testing]

## Recommendations
[Any recommendations for improvements]

**Overall Status:** [PASS/FAIL]
\`\`\`

Use this guide to thoroughly test all API functionality before going live with the career portal integration.
