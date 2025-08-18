{
    'name': 'RCC Career Portal',
    'version': '1.0.0',
    'category': 'Human Resources',
    'summary': 'Career portal integration for RCC job applications',
    'description': """
        This module extends the HR Recruitment module to support
        job applications from the RCC career portal website.
        
        Features:
        - Custom fields for applicant information
        - API endpoints for job application submission
        - CV file upload support
        - Integration with external career portal
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
}
