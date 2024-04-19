from flask import Blueprint, g,request,make_response,jsonify,session
from models import Healthcare_Professionals,Patient

user_requests_bp = Blueprint('user_requests',__name__,template_folder='/templates')



@user_requests_bp.route('/get_patients',methods=["POST"])
def get_patients():
    req = request.get_json()
    all_patients = [[p.username,p.fullname,f'{p.birth_date}'] for p in Patient.query.all()]

    theme = session.get('theme') if session.get('theme') else 'light'
    res = make_response(jsonify({'message': 'Success','all_patients': all_patients,'theme':theme}),200)

    return res


@user_requests_bp.route('/get_doctors',methods=["POST"])
def get_doctors():
    req = request.get_json()
    all_doctors = [[d.username,d.fullname,f'{d.license}'] for d in Healthcare_Professionals.query.filter_by(title='Doctor').all()]

    theme = session.get('theme') if session.get('theme') else 'light'
    res = make_response(jsonify({'message': 'Success','all_doctors': all_doctors,'theme':theme}),200)

    return res


@user_requests_bp.route('/add_patient_to_hcp_list',methods=["POST"])
def add_patient_to_hcp_list():
    req = request.get_json()
    username = req.get("patient")

    if username not in [p.username for p in g.user.patients]:
        hcp_patients = Healthcare_Professionals.add_patient_to_doctor(g.user,username)
        res = make_response(jsonify({'message': f'Successfully added Patient ({username}) to HCP ({g.user.username})','hcp_patients':hcp_patients}),200)
    else:
        res = make_response(jsonify({'message': 'Patient is already in your list.'}),200)

    return res


@user_requests_bp.route('/add_hcp_to_patient_list',methods=["POST"])
def add_hcp_to_patient_list():
    req = request.get_json()
    doctor_username = req.get("doctor")

    if g.user.username == session.get("assessment").get("patient_username"):
        curr_patient_username = g.user.username
        curr_patient = g.user
    else:
        curr_patient_username = session.get("assessment").get("patient_username")
        curr_patient = Patient.query.filter_by(username=curr_patient_username).one()

    doctors = curr_patient.doctors

    if doctor_username not in [d.username for d in doctors]:
        patient_doctors = Patient.add_doctor_to_patient(curr_patient,doctor_username)
        res = make_response(jsonify({'message': f'Successfully added Doctor ({doctor_username}) to Patient ({curr_patient_username})','patient_doctors':patient_doctors}),200)
    else:
        res = make_response(jsonify({'message': f'Failure: Doctor already in patient-list'}),200)

    return res

