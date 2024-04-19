from flask import Blueprint, render_template,redirect,flash, g,request,session
from models import Healthcare_Professionals,Patient,Admin,Assessment,get_item_log_n
from forms import LogIn_Admin,LogIn,LogIn_HCP
import json

assessments_bp = Blueprint('assessments',__name__,template_folder='/templates')

# ASSESSMENTS PAGE, ASSESSMENT SUMMARY/DETAILS, DELETE ASSESSMENT ---------------------------------------------------------------PART03
@assessments_bp.route('/<username>/assessments')
def all_assessments(username):
    if not g.user or g.user.username != username:
        return redirect('/register')
    if not isinstance(g.user,Patient) and not g.user.is_verified:
        return redirect('/')

    if isinstance(g.user,Healthcare_Professionals):
        assessments = g.user.get_patient_assessments()
    else:
        assessments = g.user.assessments

    return render_template('assessments.html',assessments=assessments)


@assessments_bp.route('/assessment/<assessment_id>')
def assessment_page(assessment_id):
    if not g.user:
        return redirect('/')
    if not isinstance(g.user,Patient) and not g.user.is_verified:
        return redirect('/')


    assessment = Assessment.query.filter_by(id=assessment_id).one()
    patient = assessment.patient
    doctor = assessment.doctor

    user_completed_by_patient = Patient.query.filter_by(username = assessment.completed_by_username).one_or_none() 
    user_completed_by = user_completed_by_patient if user_completed_by_patient else Healthcare_Professionals.query.filter_by(username = assessment.completed_by_username).one_or_none()

    if g.user != patient and g.user != doctor and g.user != user_completed_by and g.user not in Healthcare_Professionals.query.filter_by(institution_id=doctor.institution_id).all():
        return redirect('/')

    # NOTE: This will be modified once the JSON FIle is sorted by name so that we can retrieve a question using O(log n).
    questions = assessment.get_assessment_questions()
    suggested_tests = assessment.get_suggested_tests()

    if assessment.official_diagnosis:
        with open('DiseasesOutput.json') as file: 
            data = json.load(file)

            official_diagnosis = get_item_log_n(data,assessment.official_diagnosis)
            official_diagnosis = (official_diagnosis['text'],official_diagnosis['laytext']) if official_diagnosis else None

    else:
        official_diagnosis = assessment.official_diagnosis
        

    assessment_obj = {
        'id': assessment_id,
        'symptom_statement': assessment.chief_complaint,
        'questions': questions,
        'suggestions_tests': suggested_tests,
        'analysis_results': [d.diagnosis_name for d in assessment.potential_diagnoses],
        'notes': assessment.notes,
        'official_diagnosis': official_diagnosis,
        'follow_up_questions': assessment.follow_up_questions
    }

    return render_template('assessment_details.html',user_completed_by=user_completed_by,patient=patient,doctor=doctor,assessment=assessment_obj)


@assessments_bp.route('/assessment/<assessment_id>/delete_assessment',methods=["POST"])
def delete_assessment(assessment_id):
    if not g.user:
        return redirect('/')

    Assessment.delete_by_id(assessment_id)

    flash(f'Asessment was successfully deleted.','success')
    return redirect(f'/{g.user.username}/assessments')
