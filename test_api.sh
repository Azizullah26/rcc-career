#!/bin/bash

# RCC Career Portal API Test Script
# Usage: ./test_api.sh https://your-odoo-domain.com

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
          \"responsibilities\": \"Led development team\",
          \"currentlyWorking\": false
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

echo "🎉 API Testing Complete!"
echo "=================================="
echo "Summary:"
echo "- Job positions endpoint: ✅"
echo "- Application submission: ✅"
echo ""
echo "Test applicant created with ID: $APPLICANT_ID"
echo "Test email used: $TEST_EMAIL"
echo ""
echo "Please verify the data in Odoo HR > Recruitment > Applications"
