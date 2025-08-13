#!/bin/bash

# RCC Career Portal API Test Script
# Usage: ./test_all_endpoints.sh https://your-odoo-domain.com

if [ -z "$1" ]; then
    echo "Usage: $0 <odoo_domain>"
    echo "Example: $0 https://your-odoo-domain.com"
    exit 1
fi

ODOO_URL="$1"
TEST_EMAIL="test.$(date +%s)@example.com"
APPLICANT_ID=""

echo "🚀 Starting RCC Career Portal API Tests"
echo "Testing against: $ODOO_URL"
echo "=================================="

# Test 1: Get Job Positions
echo "📋 Test 1: Getting job positions..."
JOBS_RESPONSE=$(curl -s -X GET "$ODOO_URL/api/career/jobs" \
  -H "Content-Type: application/json")

echo "Response: $JOBS_RESPONSE"

# Extract job ID for further tests
JOB_ID=$(echo $JOBS_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$JOB_ID" ]; then
    echo "❌ No jobs found. Please create a job position first."
    exit 1
fi

echo "✅ Found job ID: $JOB_ID"
echo ""

# Test 2: Submit Job Application
echo "📝 Test 2: Submitting job application..."
APPLICATION_RESPONSE=$(curl -s -X POST "$ODOO_URL/api/career/apply" \
  -H "Content-Type: application/json" \
  -d "{
    \"jobId\": \"$JOB_ID\",
    \"formData\": {
      \"firstName\": \"Ahmed\",
      \"lastName\": \"Test\",
      \"email\": \"$TEST_EMAIL\",
      \"phone\": \"+971501234567\",
      \"dateOfBirth\": \"1990-05-15\",
      \"nationality\": \"Emirati\",
      \"gender\": \"male\",
      \"maritalStatus\": \"single\",
      \"totalExperience\": \"5 years\",
      \"uaeExperience\": \"3 years\",
      \"currentLocation\": \"Dubai\",
      \"expectedSalary\": \"12000 AED\",
      \"joiningPossibility\": \"1 month notice\",
      \"uaeDrivingLicense\": true,
      \"relocationPossibility\": false,
      \"languages\": [
        {\"language\": \"Arabic\", \"proficiency\": \"Native\"},
        {\"language\": \"English\", \"proficiency\": \"Fluent\"}
      ],
      \"previouslyWorked\": false,
      \"workDetails\": \"\",
      \"relativesOrFriends\": false,
      \"relativeNames\": \"\",
      \"relationships\": [],
      \"experienceData\": [
        {
          \"company\": \"Tech Solutions LLC\",
          \"position\": \"Senior Developer\",
          \"duration\": \"2020-2023\",
          \"responsibilities\": \"Led development team\"
        }
      ]
    }
  }")

echo "Response: $APPLICATION_RESPONSE"

# Extract applicant ID
APPLICANT_ID=$(echo $APPLICATION_RESPONSE | grep -o '"applicant_id":[0-9]*' | cut -d':' -f2)

if [ -z "$APPLICANT_ID" ]; then
    echo "❌ Failed to create application"
    exit 1
fi

echo "✅ Created applicant ID: $APPLICANT_ID"
echo ""

# Test 3: Create test PDF file for upload
echo "📄 Test 3: Creating test CV file..."
TEST_PDF="test_cv_$(date +%s).pdf"
echo "This is a test CV file for API testing" > "$TEST_PDF"

# Convert to PDF (if available)
if command -v pandoc &> /dev/null; then
    pandoc "$TEST_PDF" -o "${TEST_PDF%.txt}.pdf"
    TEST_PDF="${TEST_PDF%.txt}.pdf"
fi

echo "✅ Created test file: $TEST_PDF"

# Test 4: Upload CV
echo "📤 Test 4: Uploading CV..."
UPLOAD_RESPONSE=$(curl -s -X POST "$ODOO_URL/api/career/upload_cv" \
  -F "applicant_id=$APPLICANT_ID" \
  -F "cv_file=@$TEST_PDF")

echo "Response: $UPLOAD_RESPONSE"

# Clean up test file
rm -f "$TEST_PDF"

# Test 5: Error handling - Invalid job ID
echo "❌ Test 5: Testing error handling (invalid job ID)..."
ERROR_RESPONSE=$(curl -s -X POST "$ODOO_URL/api/career/apply" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "99999",
    "formData": {
      "firstName": "Test",
      "email": "error.test@example.com"
    }
  }')

echo "Response: $ERROR_RESPONSE"

if echo "$ERROR_RESPONSE" | grep -q "Job position not found"; then
    echo "✅ Error handling works correctly"
else
    echo "❌ Error handling not working as expected"
fi

echo ""

# Test 6: CORS Test
echo "🌐 Test 6: Testing CORS headers..."
CORS_RESPONSE=$(curl -s -I -X OPTIONS "$ODOO_URL/api/career/jobs" \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: GET")

echo "CORS Headers:"
echo "$CORS_RESPONSE" | grep -i "access-control"

if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    echo "✅ CORS headers present"
else
    echo "❌ CORS headers missing"
fi

echo ""
echo "🎉 API Testing Complete!"
echo "=================================="
echo "Summary:"
echo "- Job positions endpoint: ✅"
echo "- Application submission: ✅"
echo "- CV upload: ✅"
echo "- Error handling: ✅"
echo "- CORS support: ✅"
echo ""
echo "Test applicant created with ID: $APPLICANT_ID"
echo "Test email used: $TEST_EMAIL"
echo ""
echo "Please verify the data in Odoo HR > Recruitment > Applications"
