# -*- coding: utf-8 -*-
"""
Extended HR Applicant Model for RCC Career Portal
Adds additional fields required for comprehensive job applications
"""

from odoo import models, fields, api
import json

class HrApplicant(models.Model):
    _inherit = 'hr.applicant'
    
    # Personal Information Fields
    x_date_of_birth = fields.Date(
        string='Date of Birth',
        help='Applicant date of birth'
    )
    
    x_nationality = fields.Char(
        string='Nationality',
        size=50,
        help='Applicant nationality'
    )
    
    x_gender = fields.Selection([
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ], string='Gender', help='Applicant gender')
    
    x_marital_status = fields.Selection([
        ('single', 'Single'),
        ('married', 'Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed')
    ], string='Marital Status', help='Applicant marital status')
    
    # Experience Information Fields
    x_total_experience = fields.Char(
        string='Total Experience',
        size=50,
        help='Total years of experience'
    )
    
    x_uae_experience = fields.Char(
        string='UAE Experience',
        size=50,
        help='Years of experience in UAE'
    )
    
    x_current_location = fields.Char(
        string='Current Location',
        size=100,
        help='Current location of applicant'
    )
    
    x_expected_salary = fields.Char(
        string='Expected Salary',
        size=50,
        help='Expected salary range'
    )
    
    x_joining_possibility = fields.Char(
        string='Joining Possibility',
        size=50,
        help='When can the applicant join'
    )
    
    # Additional Information Fields
    x_uae_driving_license = fields.Boolean(
        string='UAE Driving License',
        default=False,
        help='Does applicant have UAE driving license'
    )
    
    x_relocation_possibility = fields.Boolean(
        string='Relocation Possibility',
        default=False,
        help='Is applicant willing to relocate'
    )
    
    x_languages = fields.Text(
        string='Languages',
        help='Languages known by applicant (stored as JSON)'
    )
    
    # Application Questions Fields
    x_previously_worked = fields.Boolean(
        string='Previously Worked with Company',
        default=False,
        help='Has applicant worked with the company before'
    )
    
    x_work_details = fields.Text(
        string='Previous Work Details',
        help='Details about previous work with company'
    )
    
    x_relatives_friends = fields.Boolean(
        string='Relatives/Friends in Company',
        default=False,
        help='Does applicant have relatives or friends in company'
    )
    
    x_relative_names = fields.Text(
        string='Names of Relatives/Friends',
        help='Names of relatives or friends in company'
    )
    
    x_relationships = fields.Text(
        string='Relationships',
        help='Relationship details (stored as JSON)'
    )
    
    # Experience Data Fields
    x_experience_data = fields.Text(
        string='Experience Data',
        help='Detailed experience information (stored as JSON)'
    )
    
    # Source Information Fields
    x_source_website = fields.Char(
        string='Source Website',
        default='RCC Career Portal',
        help='Website source of application'
    )
    
    # Computed Fields for Better Display
    x_languages_display = fields.Char(
        string='Languages (Display)',
        compute='_compute_languages_display',
        store=True,
        help='Human readable languages list'
    )
    
    x_experience_summary = fields.Text(
        string='Experience Summary',
        compute='_compute_experience_summary',
        store=True,
        help='Summary of work experience'
    )
    
    @api.depends('x_languages')
    def _compute_languages_display(self):
        """Convert JSON languages to readable format"""
        for record in self:
            if record.x_languages:
                try:
                    languages = json.loads(record.x_languages)
                    lang_list = [f"{lang.get('language', '')} ({lang.get('proficiency', '')})" 
                               for lang in languages if isinstance(lang, dict)]
                    record.x_languages_display = ', '.join(lang_list)
                except (json.JSONDecodeError, AttributeError):
                    record.x_languages_display = record.x_languages
            else:
                record.x_languages_display = ''
    
    @api.depends('x_experience_data')
    def _compute_experience_summary(self):
        """Convert JSON experience data to readable format"""
        for record in self:
            if record.x_experience_data:
                try:
                    experiences = json.loads(record.x_experience_data)
                    exp_list = []
                    for exp in experiences:
                        if isinstance(exp, dict):
                            company = exp.get('company', '')
                            position = exp.get('position', '')
                            duration = exp.get('duration', '')
                            if company and position:
                                exp_list.append(f"{position} at {company} ({duration})")
                    record.x_experience_summary = '\n'.join(exp_list)
                except (json.JSONDecodeError, AttributeError):
                    record.x_experience_summary = record.x_experience_data or ''
            else:
                record.x_experience_summary = ''
    
    def get_languages_list(self):
        """Helper method to get languages as list"""
        if self.x_languages:
            try:
                return json.loads(self.x_languages)
            except json.JSONDecodeError:
                return []
        return []
    
    def get_experience_list(self):
        """Helper method to get experience as list"""
        if self.x_experience_data:
            try:
                return json.loads(self.x_experience_data)
            except json.JSONDecodeError:
                return []
        return []
    
    def get_relationships_list(self):
        """Helper method to get relationships as list"""
        if self.x_relationships:
            try:
                return json.loads(self.x_relationships)
            except json.JSONDecodeError:
                return []
        return []
