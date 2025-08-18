{
    'name': 'RCC Career Portal',
    'version': '1.0.0',
    'category': 'Human Resources',
    'summary': 'Career portal integration for RCC job applications',
    'description': """
RCC Career Portal Integration
=============================

This module provides integration between the RCC career portal website and Odoo HR.

Features:
- Receive job applications from the career portal
- Store applicant information in hr.applicant model
- Handle CV file uploads
- Track application source and portal URL

Installation:
1. Copy this module to your Odoo addons directory
2. Update the app list in Odoo
3. Install the module from Apps menu

Configuration:
- No additional configuration required
- All custom fields are automatically created
    """,
    'author': 'RCC Development Team',
    'website': 'https://careerrccv5.vercel.app',
    'depends': ['hr_recruitment', 'website'],
    'data': [
        'security/ir.model.access.csv',
        'views/hr_applicant_views.xml',
        'data/website_data.xml',
    ],
    'installable': True,
    'auto_install': False,
    'application': False,
    'license': 'LGPL-3',
}
