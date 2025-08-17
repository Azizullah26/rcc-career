# -*- coding: utf-8 -*-
{
    'name': 'RCC Career Portal Integration',
    'version': '1.0.0',
    'category': 'Human Resources',
    'sequence': 10,
    'summary': 'Integration module for RCC Career Portal website with job applications and CV management',
    'description': """
RCC Career Portal Integration
=============================

This module provides comprehensive integration between the RCC Career Portal website 
and Odoo's HR Recruitment system.

Key Features:
-------------
* Extended hr.applicant model with additional fields for career portal
* REST API endpoints for job applications submission
* CV file upload and management functionality
* Job positions API for website integration
* Enhanced applicant tracking with portal-specific data
* Support for multiple application stages and custom fields
* Integration with Odoo's existing HR recruitment workflow

Technical Features:
------------------
* Secure API endpoints with proper authentication
* File upload handling for CVs and documents
* Custom fields for nationality, gender, experience details
* Extended application questions support
* Integration with existing Odoo security model

API Endpoints:
--------------
* /api/career/jobs - Get available job positions
* /api/career/apply - Submit job application with CV
* /api/career/applicant/<id> - Get applicant details

This module is specifically designed for RCC's career portal requirements
and integrates seamlessly with the existing HR recruitment process.
    """,
    'author': 'RCC Development Team',
    'website': 'https://careerrccv4.vercel.app',
    'depends': [
        'base',
        'hr',
        'hr_recruitment',
        'website',
        'mail',
        'portal',
    ],
    'data': [
        'security/ir.model.access.csv',
        'views/hr_applicant_views.xml',
        'data/website_data.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'rcc_career_portal/static/src/css/career_portal.css',
            'rcc_career_portal/static/src/js/career_portal.js',
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
        'python': ['requests', 'werkzeug'],
    },
    'post_init_hook': 'post_init_hook',
    'uninstall_hook': 'uninstall_hook',
}
