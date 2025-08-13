# -*- coding: utf-8 -*-
{
    'name': 'RCC Career Portal Integration',
    'version': '1.0.0',
    'category': 'Human Resources',
    'summary': 'Integration module for RCC Career Portal website',
    'description': """
        This module provides API endpoints and model extensions
        to integrate with the RCC Career Portal website.
        
        Features:
        - Extended hr.applicant model with additional fields
        - REST API endpoints for job applications
        - CV file upload functionality
        - Job positions API
    """,
    'author': 'RCC Development Team',
    'website': 'https://rcc.ae',
    'depends': ['hr_recruitment', 'website'],
    'data': [
        'security/ir.model.access.csv',
        'views/hr_applicant_views.xml',
        'data/website_data.xml',
    ],
    'installable': True,
    'auto_install': False,
    'application': False,
}
