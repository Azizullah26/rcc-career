# -*- coding: utf-8 -*-
"""
Odoo Controller Example for RCC Career Portal
This file shows your Odoo developer how to create clean API endpoints
"""

import json
import base64
from odoo import http
from odoo.http import request
import logging

_logger = logging.getLogger(__name__)

class CareerPortalController(http.Controller):
    
    @http.route('/api/career/apply', type='json', auth='public', methods=['POST'], csrf=False)
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
                        "responsibilities": "Developed web applications"
                    }
                ]
            }
        }
        """
        try:
            data = kwargs
            job_id = data.get('jobId')
            form_data = data.get('formData', {})
            
            # Validate required fields
            if not job_id or not form_data:
                return {'error': 'Missing required data'}
            
            # Create hr.applicant record
            applicant_data = {
                'name': f"{form_data.get('firstName', '')} {form_data.get('lastName', '')}",
                'email_from': form_data.get('email'),
                'partner_phone': form_data.get('phone'),
                'job_id': int(job_id),
                
                # Personal Information
                'date_of_birth': form_data.get('dateOfBirth'),
                'nationality': form_data.get('nationality'),
                'gender': form_data.get('gender'),
                'marital_status': form_data.get('maritalStatus'),
                
                # Experience Information
                'total_experience': form_data.get('totalExperience'),
                'uae_experience': form_data.get('uaeExperience'),
                'current_location': form_data.get('currentLocation'),
                'expected_salary': form_data.get('expectedSalary'),
                'joining_possibility': form_data.get('joiningPossibility'),
                
                # Additional Information
                'uae_driving_license': form_data.get('uaeDrivingLicense', False),
                'relocation_possibility': form_data.get('relocationPossibility', False),
                'languages': json.dumps(form_data.get('languages', [])),
                
                # Application Questions
                'previously_worked': form_data.get('previouslyWorked', False),
                'work_details': form_data.get('workDetails', ''),
                'relatives_friends': form_data.get('relativesOrFriends', False),
                'relative_names': form_data.get('relativeNames', ''),
                'relationships': json.dumps(form_data.get('relationships', [])),
                
                # Experience Data
                'experience_data': json.dumps(form_data.get('experienceData', [])),
                
                # Source Information
                'source_website': 'RCC Career Portal',
            }
            
            # Create the applicant
            applicant = request.env['hr.applicant'].sudo().create(applicant_data)
            
            _logger.info(f"Created job application with ID: {applicant.id}")
            
            return {
                'success': True,
                'applicant_id': applicant.id,
                'message': 'Application created successfully'
            }
            
        except Exception as e:
            _logger.error(f"Error creating job application: {str(e)}")
            return {'error': str(e)}
    
    @http.route('/api/career/upload_cv', type='http', auth='public', methods=['POST'], csrf=False)
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
                return json.dumps({'error': 'Missing applicant_id or cv_file'})
            
            # Read file data
            file_data = cv_file.read()
            file_base64 = base64.b64encode(file_data).decode('utf-8')
            
            # Create attachment
            attachment_data = {
                'name': cv_file.filename,
                'datas': file_base64,
                'res_model': 'hr.applicant',
                'res_id': int(applicant_id),
                'mimetype': cv_file.content_type,
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
            return json.dumps({'error': str(e)})
    
    @http.route('/api/career/jobs', type='json', auth='public', methods=['GET'], csrf=False)
    def get_job_positions(self, **kwargs):
        """
        Get active job positions
        """
        try:
            jobs = request.env['hr.job'].sudo().search([
                ('state', '=', 'recruit')
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
                })
            
            return {
                'success': True,
                'jobs': job_list
            }
            
        except Exception as e:
            _logger.error(f"Error fetching jobs: {str(e)}")
            return {'error': str(e)}


# Model Extension Example
# Your Odoo developer should add these fields to hr.applicant model

"""
from odoo import models, fields, api

class HrApplicant(models.Model):
    _inherit = 'hr.applicant'
    
    # Personal Information
    date_of_birth = fields.Date(string='Date of Birth')
    nationality = fields.Char(string='Nationality', size=50)
    gender = fields.Selection([
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ], string='Gender')
    marital_status = fields.Selection([
        ('single', 'Single'),
        ('married', 'Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed')
    ], string='Marital Status')
    
    # Experience Information
    total_experience = fields.Char(string='Total Experience', size=50)
    uae_experience = fields.Char(string='UAE Experience', size=50)
    current_location = fields.Char(string='Current Location', size=100)
    expected_salary = fields.Char(string='Expected Salary', size=50)
    joining_possibility = fields.Char(string='Joining Possibility', size=50)
    
    # Additional Information
    uae_driving_license = fields.Boolean(string='UAE Driving License', default=False)
    relocation_possibility = fields.Boolean(string='Relocation Possibility', default=False)
    languages = fields.Text(string='Languages (JSON)')
    
    # Application Questions
    previously_worked = fields.Boolean(string='Previously Worked with Company', default=False)
    work_details = fields.Text(string='Work Details')
    relatives_friends = fields.Boolean(string='Relatives/Friends in Company', default=False)
    relative_names = fields.Text(string='Names of Relatives/Friends')
    relationships = fields.Text(string='Relationships (JSON)')
    
    # Experience Data
    experience_data = fields.Text(string='Experience Data (JSON)')
    
    # Source Information
    source_website = fields.Char(string='Source Website', default='RCC Career Portal')
"""
