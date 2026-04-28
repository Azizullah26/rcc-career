# -*- coding: utf-8 -*-
"""
RCC Career Portal API Controller
Handles job application submissions from the career website
"""

import json
import base64
import logging
from odoo import http
from odoo.http import request
from odoo.exceptions import ValidationError

_logger = logging.getLogger(__name__)

class CareerPortalController(http.Controller):
    
    @http.route('/api/career/apply', type='json', auth='public', methods=['POST'], csrf=False, cors='*')
    def create_application(self, **kwargs):
        """
        Create a new job application from career portal
        
        Expected JSON payload:
        {
            "jobId": "1",
            "formData": {
                "firstName": "John",
                "lastName": "Doe",
                "email": "john@example.com",
                "phone": "+971501234567",
                "dateOfBirth": "1990-01-01",
                "nationality": "Indian",
                "gender": "male",
                "maritalStatus": "single",
                "totalExperience": "5 years",
                "uaeExperience": "2 years",
                "currentLocation": "Dubai",
                "expectedSalary": "8000 AED",
                "joiningPossibility": "Immediately",
                "uaeDrivingLicense": true,
                "relocationPossibility": false,
                "languages": [
                    {"language": "English", "proficiency": "Fluent"},
                    {"language": "Arabic", "proficiency": "Basic"}
                ],
                "previouslyWorked": false,
                "workDetails": "",
                "relativesOrFriends": false,
                "relativeNames": "",
                "relationships": [],
                "experienceData": [
                    {
                        "company": "ABC Company",
                        "position": "Software Developer",
                        "duration": "2020-2023",
                        "responsibilities": "Developed web applications",
                        "currentlyWorking": false
                    }
                ]
            }
        }
        """
        try:
            # Set CORS headers
            if request.httprequest.method == 'OPTIONS':
                return self._handle_cors()
            
            data = kwargs
            job_id = data.get('jobId')
            form_data = data.get('formData', {})
            
            # Validate required fields
            if not job_id or not form_data:
                return {'error': 'Missing required data', 'success': False}
            
            # Validate job exists
            job = request.env['hr.job'].sudo().browse(int(job_id))
            if not job.exists():
                return {'error': 'Job position not found', 'success': False}
            
            # Create hr.applicant record
            applicant_data = {
                'name': f"{form_data.get('firstName', '')} {form_data.get('lastName', '')}".strip(),
                'email_from': form_data.get('email'),
                'partner_phone': form_data.get('phone'),
                'job_id': int(job_id),
                
                # Personal Information
                'x_date_of_birth': form_data.get('dateOfBirth'),
                'x_nationality': form_data.get('nationality'),
                'x_gender': form_data.get('gender'),
                'x_marital_status': form_data.get('maritalStatus'),
                
                # Experience Information
                'x_total_experience': form_data.get('totalExperience'),
                'x_uae_experience': form_data.get('uaeExperience'),
                'x_current_location': form_data.get('currentLocation'),
                'x_expected_salary': form_data.get('expectedSalary'),
                'x_joining_possibility': form_data.get('joiningPossibility'),
                
                # Additional Information
                'x_uae_driving_license': form_data.get('uaeDrivingLicense', False),
                'x_relocation_possibility': form_data.get('relocationPossibility', False),
                'x_languages': json.dumps(form_data.get('languages', [])),
                
                # Application Questions
                'x_previously_worked': form_data.get('previouslyWorked', False),
                'x_work_details': form_data.get('workDetails', ''),
                'x_relatives_friends': form_data.get('relativesOrFriends', False),
                'x_relative_names': form_data.get('relativeNames', ''),
                'x_relationships': json.dumps(form_data.get('relationships', [])),
                
                # Experience Data
                'x_experience_data': json.dumps(form_data.get('experienceData', [])),
                
                # Source Information
                'x_source_website': 'RCC Career Portal',
                'source_id': self._get_or_create_source(),
            }
            
            bot_user = request.env['res.users'].sudo().search([
                ('login', '=', 'odoobot@example.com')
            ], limit=1)
            
            if not bot_user:
                _logger.warning("Bot user odoobot@example.com not found, using sudo context instead")
                bot_user = None
            
            # Create the applicant with bot user context
            if bot_user:
                # Create as bot user specifically
                applicant = request.env['hr.applicant'].sudo().with_user(bot_user).create(applicant_data)
            else:
                # Fallback to regular sudo if bot user not found
                applicant = request.env['hr.applicant'].sudo().create(applicant_data)
            
            _logger.info(f"Created job application with ID: {applicant.id} for job: {job.name}")
            
            return {
                'success': True,
                'applicant_id': applicant.id,
                'message': 'Application submitted successfully'
            }
            
        except ValidationError as e:
            _logger.error(f"Validation error creating job application: {str(e)}")
            return {'error': f'Validation error: {str(e)}', 'success': False}
        except Exception as e:
            _logger.error(f"Error creating job application: {str(e)}")
            return {'error': 'Internal server error', 'success': False}
    
    @http.route('/api/career/upload_cv', type='http', auth='public', methods=['POST'], csrf=False, cors='*')
    def upload_cv(self, **kwargs):
        """
        Upload CV file for a job applicant
        
        Form data:
        - applicant_id: ID of the hr.applicant record
        - cv_file: The CV file
        """
        try:
            applicant_id = kwargs.get('applicant_id')
            cv_file = request.httprequest.files.get('cv_file')
            
            if not applicant_id or not cv_file:
                return json.dumps({'error': 'Missing applicant_id or cv_file', 'success': False})
            
            # Validate applicant exists
            applicant = request.env['hr.applicant'].sudo().browse(int(applicant_id))
            if not applicant.exists():
                return json.dumps({'error': 'Applicant not found', 'success': False})
            
            # Validate file type and size
            allowed_types = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
            max_size = 5 * 1024 * 1024  # 5MB
            
            if cv_file.content_type not in allowed_types:
                return json.dumps({'error': 'Invalid file type. Only PDF and Word documents are allowed.', 'success': False})
            
            # Read file data
            file_data = cv_file.read()
            
            if len(file_data) > max_size:
                return json.dumps({'error': 'File too large. Maximum size is 5MB.', 'success': False})
            
            file_base64 = base64.b64encode(file_data).decode('utf-8')
            
            # Create attachment
            attachment_data = {
                'name': cv_file.filename,
                'datas': file_base64,
                'res_model': 'hr.applicant',
                'res_id': int(applicant_id),
                'mimetype': cv_file.content_type,
                'description': 'CV uploaded from RCC Career Portal',
            }
            
            attachment = request.env['ir.attachment'].sudo().create(attachment_data)
            
            _logger.info(f"Uploaded CV for applicant {applicant_id}, attachment ID: {attachment.id}")
            
            return json.dumps({
                'success': True,
                'attachment_id': attachment.id,
                'message': 'CV uploaded successfully'
            })
            
        except Exception as e:
            _logger.error(f"Error uploading CV: {str(e)}")
            return json.dumps({'error': 'Failed to upload CV', 'success': False})
    
    @http.route('/api/career/jobs', type='json', auth='public', methods=['GET'], csrf=False, cors='*')
    def get_job_positions(self, **kwargs):
        """
        Get active job positions
        """
        try:
            jobs = request.env['hr.job'].sudo().search([
                ('state', '=', 'recruit'),
                ('website_published', '=', True)
            ])
            
            job_list = []
            for job in jobs:
                job_list.append({
                    'id': job.id,
                    'name': job.name,
                    'department': job.department_id.name if job.department_id else '',
                    'location': job.address_id.city if job.address_id else '',
                    'description': job.description or '',
                    'requirements': job.requirements or '',
                    'expected_employees': job.expected_employees,
                    'no_of_recruitment': job.no_of_recruitment,
                })
            
            return {
                'success': True,
                'jobs': job_list,
                'count': len(job_list)
            }
            
        except Exception as e:
            _logger.error(f"Error fetching jobs: {str(e)}")
            return {'error': 'Failed to fetch jobs', 'success': False}
    
    def _get_or_create_source(self):
        """Get or create utm.source for career portal"""
        source = request.env['utm.source'].sudo().search([('name', '=', 'RCC Career Portal')], limit=1)
        if not source:
            source = request.env['utm.source'].sudo().create({
                'name': 'RCC Career Portal'
            })
        return source.id
    
    def _handle_cors(self):
        """Handle CORS preflight requests"""
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
        return request.make_response('', headers=headers)
