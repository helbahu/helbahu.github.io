from flask import Blueprint, render_template,redirect,flash, g,request,session
from models import Healthcare_Professionals,Patient,Assessment,API_Requests
from forms import SymptomForm,SymptomForm_add_more_symptoms,SymptomForm_suggested_questions,Add_Doctor
import json

assessment_bp = Blueprint('assessment_forms',__name__,template_folder='/templates')


# START ASSESSMENT, SUGGESTED QUESTIONS, ASSESSMENT SUMMARY, ADD DOCTOR, SAVE -------------------------------------------------PART05
@assessment_bp.route('/<username>/assessment',methods=['GET','POST'])
def start_assessment(username):
    if not g.user or g.user.username != username:
        return redirect('/register')
    if not isinstance(g.user,Patient) and not g.user.is_verified:
        return redirect('/')

    user = g.user

    if not session.get('assessment'):
        assessment_id = API_Requests.get_assessment_id()
        session["assessment"] = {
            'id': assessment_id,
            'patient_username': None,
            'symptom_statement': None,
            'questions': [],
            'suggestions': None,
            'suggestions_tests': None,
            'doctor_username': None,
            'analysis_results': None
        }


    if session.get("assessment").get('symptom_statement'):
        form = SymptomForm_add_more_symptoms()
        answered_questions = [q['question'] for q in session.get("assessment").get('questions')]
    else:
        form = SymptomForm()
        answered_questions = []
        if isinstance(g.user,Healthcare_Professionals):
            patients = user.patients
            if patients:
                form.patient_name.choices = [(p.username,f'{p.fullname} ({p.birth_date})') for p in patients]
            else:
                form.patient_name.choices = [("None","None")]
        else:
            form.patient_name.choices = [(username,username)]


    with open('SymptomsOutput.json') as file: 
        data = json.load(file)
        if isinstance(g.user,Healthcare_Professionals):
            form.questions.choices = [(q["name"],q["text"]) for q in data if q["name"] not in answered_questions]
        else:
            form.questions.choices = [(q["name"],q["laytext"]) for q in data if q["IsPatientProvided"] and q["name"] not in answered_questions]

    with open('symptomslist.json') as file: 
        data = json.load(file)
        form.symptomList.choices = [(i.get("label"),i.get("label")) for i in data if isinstance(i,dict)]


    if form.validate_on_submit():
        if not session.get("assessment").get('symptom_statement'):
            patient_username = form.patient_name.data
            symptom_statement = form.symptoms.data
            question = form.questions.data
            answer = form.answer.data

            result = API_Requests.UpdateQuestion(session,question,answer)

            assessment = session["assessment"]
            assessment['patient_username'] = patient_username
            assessment['symptom_statement'] = symptom_statement
            assessment['suggestions'] = result
            assessment['questions'].append({
                    'question': question,
                    'answer': answer
                })
            session["assessment"] = assessment


        else:
            question = form.questions.data
            answer = form.answer.data

            result = API_Requests.UpdateQuestion(session,question,answer)

            assessment = session.get("assessment") 
            assessment['questions'].append({
                    'question': question,
                    'answer': answer
                })
            assessment['suggestions'] = result
            session["assessment"] = assessment

        return redirect(f'/{username}/assessment')


    if session.get("assessment").get('symptom_statement'):
        return render_template('add_symptomform.html',form=form,user=user)
    else:
        return render_template('symptomform.html',form=form,user=user)


@assessment_bp.route('/<username>/assessment/suggested_questions',methods=['GET','POST'])
def assessment_suggested_questions(username):
    if not g.user or g.user.username != username:
        return redirect('/register')

    if session.get("assessment").get('suggestions'):

        form = SymptomForm_suggested_questions()

        question = session.get("assessment").get('suggestions')[0]

        if float(question[3]) > 0.01 and len(session.get("assessment").get('questions')) < 10:
            if isinstance(g.user,Healthcare_Professionals):
                form.questions.choices = [(question[0],f'{question[1]}')]
            else:
                form.questions.choices = [(question[0],f'{question[2]}')]
        else:
            return redirect(f'/{username}/assessment/add_doctor')

    else:
        return redirect(f'/{username}/assessment/add_doctor')


    if form.validate_on_submit():
        question = form.questions.data
        answer = form.answer.data

        result = API_Requests.UpdateQuestion(session,question,answer)

        assessment = session.get("assessment") 
        assessment.get('questions').append({
                'question': question,
                'answer': answer
            })
        assessment['suggestions'] = result
        session["assessment"] = assessment
        
        if result:
            return redirect(f'/{username}/assessment/suggested_questions')
        else:
            return redirect(f'/{username}/assessment/add_doctor')

    return render_template('symptomform.html',form=form,user=g.user)


@assessment_bp.route('/<username>/assessment/add_doctor',methods=['GET','POST'])
def add_doctor_to_assessment(username):
    if not g.user or g.user.username != username:
        return redirect('/register')

    results = API_Requests.Analyze(session.get('assessment').get('id'))
    diseases = [list(disease.keys())[0] for disease in results.get("Diseases")]

    assessment = session.get('assessment')
    assessment['analysis_results'] = diseases
    assessment['suggestions_tests'] = API_Requests.GetSuggestedTests(assessment["id"])
    session['assessment'] = assessment

    if isinstance(g.user,Healthcare_Professionals):
        user = g.user

        if user.title == 'Doctor':
            assessment = session.get("assessment") 
            assessment['doctor_username'] = username
            session["assessment"] = assessment 

            return redirect(f'/{username}/assessment/summary')            
        curr_patient_username = session.get("assessment").get("patient_username")
        curr_patient = Patient.query.filter_by(username=curr_patient_username).one()

    else:
        user = g.user
        curr_patient = g.user


    form = Add_Doctor()

    doctors = curr_patient.doctors
    if doctors:
        doctor_list = [(d.username,f'{d.fullname} ({d.license})') for d in doctors if d.title == 'Doctor']
        form.doctor_name.choices = doctor_list if len(doctor_list) > 0 else [("None","None")]
    else:
        form.doctor_name.choices = [("None","None")]


    if form.validate_on_submit():
        doctor_name = form.doctor_name.data
        assessment = session.get("assessment") 
        assessment['doctor_username'] = doctor_name
        session["assessment"] = assessment 
        return redirect(f'/{username}/assessment/summary')            

    return render_template('add_doctorform.html',form=form,user=user)


@assessment_bp.route('/<username>/assessment/summary',methods=["GET","POST"])
def assessment_summary(username):
    if not g.user or g.user.username != username:
        return redirect('/register')

    patient_username = session.get("assessment").get("patient_username")
    doctor_username = session.get("assessment").get("doctor_username")

    if g.user.username == patient_username:
        patient = g.user
        doctor = Healthcare_Professionals.query.filter_by(username = doctor_username).one()
    else:
        patient = Patient.query.filter_by(username = patient_username).one()
        if g.user.title == 'Doctor':
            doctor = g.user
        else:
            doctor = Healthcare_Professionals.query.filter_by(username = doctor_username).one()

    assessment = session["assessment"]

    Assessment.get_assessment_questions_from_assessment_obj(assessment)


    return render_template('assessment_summary.html',user_completed_by=g.user,patient=patient,doctor=doctor,assessment=assessment)


@assessment_bp.route('/assessment/save',methods=["POST"])
def save_assessment():
    if not g.user:
        return redirect('/register')

    assessment_id = session.get("assessment").get("id")

    if not Assessment.query.filter_by(id = assessment_id).one_or_none():
        message = Assessment.add_New_Assessment(g.user,session.get("assessment"))

        flash(message,'success')
    return redirect(f'/users/{g.user.username}')
