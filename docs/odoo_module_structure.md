# RCC Career Portal - Odoo Integration Module

## Module Structure

\`\`\`
rcc_career_portal/
├── __init__.py
├── __manifest__.py
├── controllers/
│   ├── __init__.py
│   └── career_portal.py
├── models/
│   ├── __init__.py
│   └── hr_applicant.py
├── security/
│   └── ir.model.access.csv
├── views/
│   └── hr_applicant_views.xml
└── data/
    └── website_data.xml
\`\`\`

## Installation Instructions

1. Create the module folder in your Odoo addons directory
2. Copy all files to the module folder
3. Update apps list in Odoo
4. Install the "RCC Career Portal" module
5. Configure the website settings if needed

## Environment Variables Required

Set these in your Odoo server configuration or environment:
- ODOO_URL: Your Odoo server URL
- ODOO_DB: Database name
- ODOO_USER: API user email
- ODOO_PASSWORD: API user password

## API Endpoints Created

- POST `/api/career/apply` - Create job application
- POST `/api/career/upload_cv` - Upload CV file
- GET `/api/career/jobs` - Get active job positions

## Database Fields Added

The module extends hr.applicant model with 20+ new fields for comprehensive job application data.
\`\`\`

\`\`\`python file="docs/__manifest__.py"
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
