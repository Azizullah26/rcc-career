# -*- coding: utf-8 -*-
{
    'name': 'RCC Career Portal Integration',
    'version': '1.0.0',
    'category': 'Human Resources',
    'sequence': 100,
    'summary': 'Integration module for RCC Career Portal with Odoo HR Recruitment',
    'description': """
RCC Career Portal Integration
=============================

This module provides seamless integration between the RCC Career Portal website 
(https://careerrccv2.vercel.app/) and Odoo's HR Recruitment system.

Key Features:
* Extended HR Applicant model with additional fields for career portal
* API endpoints for job application submissions
* CV/Resume file upload and attachment management
* Enhanced job position management
* Automated email notifications for applicants
* Custom views for managing career portal applications
* Security rules for proper access control

Technical Details:
* REST API integration with Next.js career portal
* Extended hr.applicant model with custom fields
* File upload handling for CVs and documents
* Email template system for applicant communications
* Custom security groups and access rules

Installation:
1. Install this module in your Odoo instance
2. Configure the API credentials in your career portal
3. Test the integration using the provided test scripts

For technical support, contact the development team.
    """,
    'author': 'RCC Development Team',
    'website': 'https://careerrccv2.vercel.app/',
    'license': 'LGPL-3',
    'depends': [
        'base',
        'hr',
        'hr_recruitment',
        'website',
        'mail',
        'portal',
        'contacts',
    ],
    'data': [
        # Security
        'security/ir.model.access.csv',
        'security/career_portal_security.xml',
        
        # Views
        'views/hr_applicant_views.xml',
        'views/hr_job_views.xml',
        'views/career_portal_menus.xml',
        
        # Data
        'data/hr_recruitment_stage_data.xml',
        'data/email_template_data.xml',
        'data/website_data.xml',
        
        # Reports (optional)
        'reports/applicant_report_views.xml',
    ],
    'demo': [
        'demo/hr_job_demo.xml',
        'demo/hr_applicant_demo.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'rcc_career_portal/static/src/css/career_portal.css',
            'rcc_career_portal/static/src/js/career_portal.js',
        ],
        'web.assets_frontend': [
            'rcc_career_portal/static/src/css/portal_frontend.css',
        ],
    },
    'images': [
        'static/description/banner.png',
        'static/description/icon.png',
    ],
    'installable': True,
    'auto_install': False,
    'application': False,
    'external_dependencies': {
        'python': ['requests', 'json'],
    },
    'post_init_hook': 'post_init_hook',
    'uninstall_hook': 'uninstall_hook',
}
