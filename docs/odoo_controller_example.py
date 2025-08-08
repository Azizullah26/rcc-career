# Give this file to your Odoo developer as an example controller.
# It creates clean endpoints your Next.js app can call instead of JSON-RPC.
# Place within an Odoo custom module under: controllers/career_api.py

from odoo import http
from odoo.http import request
import base64
import json

class CareerAPI(http.Controller):

    @http.route('/api/career/application', type='json', auth='public', methods=['POST'], csrf=False)
    def create_application(self, **kwargs):
        try:
            data = request.jsonrequest or {}
            job_id = int(data.get('jobId'))
            f = data.get('formData') or {}

            applicant_vals = {
                'partner_name': f.get('fullName'),
                'email_from': f.get('email'),
                'partner_phone': f.get('phone'),
                'date_of_birth': f.get('dob') or False,
                'nationality': f.get('nationality') or False,
                'gender': f.get('gender') or False,
                'marital_status': f.get('maritalStatus') or False,
                'job_id': job_id,
                'name': f"Application for Job ID: {job_id} - {f.get('fullName')}",
                'description': 'Application submitted through career portal',
                'total_experience': f.get('totalExperience') or False,
                'uae_experience': f.get('uaeExperience') or False,
                'current_location': f.get('currentLocation') or False,
                'expected_salary': f.get('expectedSalary') or False,
                'joining_possibility': f.get('joiningPossibility') or False,
                'uae_driving_license': True if f.get('uaeDrivingLicense') == 'yes' else False,
                'relocation_possibility': True if f.get('relocationPossibility') == 'yes' else False,
                'languages': json.dumps(f.get('languages') or []),
                'previously_worked': True if f.get('previouslyWorked') == 'yes' else False,
                'work_details': f.get('workDetails') or '',
                'relatives_friends': True if f.get('relativesOrFriends') == 'yes' else False,
                'relative_names': f.get('names') or '',
                'relationships': json.dumps(f.get('selectedRelationships') or []),
                'experience_data': json.dumps(f.get('experienceData') or {}),
            }

            applicant_id = request.env['hr.applicant'].sudo().create(applicant_vals).id
            return {'success': True, 'applicant_id': applicant_id}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    @http.route('/api/career/upload_cv', type='json', auth='public', methods=['POST'], csrf=False)
    def upload_cv(self, applicant_id=None, filename=None, mimetype=None, content_b64=None, **kwargs):
        try:
            if not applicant_id or not content_b64:
                return {'success': False, 'error': 'Missing applicant_id or content_b64'}

            vals = {
                'name': filename or 'cv.pdf',
                'datas': content_b64,
                'res_model': 'hr.applicant',
                'res_id': int(applicant_id),
                'mimetype': mimetype or 'application/octet-stream',
                'description': 'CV/Resume',
            }
            attach_id = request.env['ir.attachment'].sudo().create(vals).id
            return {'success': True, 'attachment_id': attach_id}
        except Exception as e:
            return {'success': False, 'error': str(e)}
