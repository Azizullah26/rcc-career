#!/usr/bin/env python3
"""
RCC Career Portal API Test Suite
Comprehensive testing script for all API endpoints
"""

import requests
import json
import time
import os
import sys
from datetime import datetime

class CareerPortalAPITester:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.test_results = []
        self.applicant_id = None
        
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'response': response_data
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        print()
    
    def test_get_jobs(self):
        """Test GET /api/career/jobs endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/career/jobs")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'jobs' in data:
                    job_count = len(data['jobs'])
                    self.log_test(
                        "Get Job Positions", 
                        True, 
                        f"Found {job_count} jobs",
                        data
                    )
                    return data['jobs'][0]['id'] if job_count > 0 else None
                else:
                    self.log_test("Get Job Positions", False, "Invalid response format")
            else:
                self.log_test("Get Job Positions", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Get Job Positions", False, f"Exception: {str(e)}")
        
        return None
    
    def test_submit_application(self, job_id):
        """Test POST /api/career/apply endpoint"""
        if not job_id:
            self.log_test("Submit Application", False, "No job ID available")
            return None
            
        test_email = f"test.{int(time.time())}@example.com"
        
        payload = {
            "jobId": str(job_id),
            "formData": {
                "firstName": "Ahmed",
                "lastName": "Al-Rashid",
                "email": test_email,
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
                "uaeDrivingLicense": True,
                "relocationPossibility": False,
                "languages": [
                    {"language": "Arabic", "proficiency": "Native"},
                    {"language": "English", "proficiency": "Fluent"}
                ],
                "previouslyWorked": False,
                "workDetails": "",
                "relativesOrFriends": False,
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
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/career/apply",
                json=payload,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'applicant_id' in data:
                    self.applicant_id = data['applicant_id']
                    self.log_test(
                        "Submit Application", 
                        True, 
                        f"Created applicant ID: {self.applicant_id}",
                        data
                    )
                    return self.applicant_id
                else:
                    self.log_test("Submit Application", False, "Invalid response format", data)
            else:
                self.log_test("Submit Application", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Submit Application", False, f"Exception: {str(e)}")
        
        return None
    
    def test_upload_cv(self, applicant_id):
        """Test POST /api/career/upload_cv endpoint"""
        if not applicant_id:
            self.log_test("Upload CV", False, "No applicant ID available")
            return
        
        # Create a test PDF content
        test_content = b"""%%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Test CV Content) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF"""
        
        try:
            files = {
                'cv_file': ('test_cv.pdf', test_content, 'application/pdf')
            }
            data = {
                'applicant_id': str(applicant_id)
            }
            
            response = self.session.post(
                f"{self.base_url}/api/career/upload_cv",
                files=files,
                data=data
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success'):
                    self.log_test(
                        "Upload CV", 
                        True, 
                        f"Uploaded with attachment ID: {result.get('attachment_id')}",
                        result
                    )
                else:
                    self.log_test("Upload CV", False, "Upload failed", result)
            else:
                self.log_test("Upload CV", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Upload CV", False, f"Exception: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling scenarios"""
        
        # Test 1: Invalid job ID
        try:
            payload = {
                "jobId": "99999",
                "formData": {
                    "firstName": "Test",
                    "email": "error.test@example.com"
                }
            }
            
            response = self.session.post(
                f"{self.base_url}/api/career/apply",
                json=payload,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                if not data.get('success') and 'error' in data:
                    self.log_test("Error Handling - Invalid Job ID", True, "Correctly returned error")
                else:
                    self.log_test("Error Handling - Invalid Job ID", False, "Should have returned error")
            else:
                self.log_test("Error Handling - Invalid Job ID", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Invalid Job ID", False, f"Exception: {str(e)}")
        
        # Test 2: Missing required data
        try:
            payload = {"jobId": "1"}  # Missing formData
            
            response = self.session.post(
                f"{self.base_url}/api/career/apply",
                json=payload,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                if not data.get('success') and 'error' in data:
                    self.log_test("Error Handling - Missing Data", True, "Correctly returned error")
                else:
                    self.log_test("Error Handling - Missing Data", False, "Should have returned error")
            else:
                self.log_test("Error Handling - Missing Data", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling - Missing Data", False, f"Exception: {str(e)}")
    
    def test_file_validation(self):
        """Test file upload validation"""
        if not self.applicant_id:
            self.log_test("File Validation", False, "No applicant ID available")
            return
        
        # Test invalid file type
        try:
            files = {
                'cv_file': ('test.txt', b'This is a text file', 'text/plain')
            }
            data = {
                'applicant_id': str(self.applicant_id)
            }
            
            response = self.session.post(
                f"{self.base_url}/api/career/upload_cv",
                files=files,
                data=data
            )
            
            if response.status_code == 200:
                result = response.json()
                if not result.get('success') and 'Invalid file type' in result.get('error', ''):
                    self.log_test("File Validation - Invalid Type", True, "Correctly rejected invalid file type")
                else:
                    self.log_test("File Validation - Invalid Type", False, "Should have rejected invalid file type")
            else:
                self.log_test("File Validation - Invalid Type", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("File Validation - Invalid Type", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all test cases"""
        print("🚀 Starting RCC Career Portal API Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 50)
        
        # Test 1: Get jobs
        job_id = self.test_get_jobs()
        
        # Test 2: Submit application
        applicant_id = self.test_submit_application(job_id)
        
        # Test 3: Upload CV
        self.test_upload_cv(applicant_id)
        
        # Test 4: Error handling
        self.test_error_handling()
        
        # Test 5: File validation
        self.test_file_validation()
        
        # Generate report
        self.generate_report()
    
    def generate_report(self):
        """Generate test report"""
        print("=" * 50)
        print("🎉 Test Results Summary")
        print("=" * 50)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        print()
        
        if failed_tests > 0:
            print("❌ Failed Tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
            print()
        
        # Save detailed report
        report_file = f"api_test_report_{int(time.time())}.json"
        with open(report_file, 'w') as f:
            json.dump(self.test_results, f, indent=2)
        
        print(f"📄 Detailed report saved to: {report_file}")
        
        if self.applicant_id:
            print(f"🆔 Test applicant created with ID: {self.applicant_id}")
        
        print("\n✅ Please verify the data in Odoo HR > Recruitment > Applications")

def main():
    if len(sys.argv) != 2:
        print("Usage: python test_api.py <odoo_domain>")
        print("Example: python test_api.py https://your-odoo-domain.com")
        sys.exit(1)
    
    odoo_url = sys.argv[1]
    tester = CareerPortalAPITester(odoo_url)
    tester.run_all_tests()

if __name__ == "__main__":
    main()
