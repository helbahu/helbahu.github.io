from flask_sqlalchemy import SQLAlchemy
from flask import g, session
from flask import jsonify,make_response

from sqlalchemy.dialects.postgresql import ARRAY

from sqlalchemy import and_
from datetime import datetime
from flask_bcrypt import Bcrypt
import requests
import json

import os
from dotenv import load_dotenv
# Load variables from .env file
load_dotenv()

api_base_url = os.getenv('API_BASE_URL')


db = SQLAlchemy()

bcrypt = Bcrypt()

def connect_db(app):
    'Connect to database'
    db.app = app

    db.init_app(app)


class Patient (db.Model):

    __tablename__ = 'patients'

    def __repr__(self):
        'Shows information about a patient in a readable format'
        p = self
        return f'<id: {p.id}, username: {p.username}, name: {p.fullname}>'

    id = db.Column(
        db.Integer,
        primary_key = True,
        autoincrement = True
    )
    first_name = db.Column(
        db.String(50),
        nullable = False
    )
    last_name = db.Column(
        db.String(50),
        nullable = False
    )

    username = db.Column(
        db.String(30),
        unique = True,
        nullable = False
    )
    password = db.Column(
        db.Text,
        nullable = False
    )
    email = db.Column(
        db.String(100),
        unique = True,
        nullable = False
    )
    phone_number = db.Column(
        db.Text
    )
    birth_date = db.Column(
        db.Date,
        nullable = False
    )
    sex = db.Column(
        db.Text,
        nullable = False
    )

    @property
    def fullname(self):
        return f'{self.first_name} {self.last_name}'

    @property
    def is_admin(self):
        return False


    @classmethod
    def newPatient(cls,form):
        fieldnames = ['csrf_token','confirm_password']
        vals = {f'{f.name}': f.data for f in form if f.data and f.name not in fieldnames}

        pw_hash = bcrypt.generate_password_hash(form.password.data)
        pw_hash_utf8 = pw_hash.decode('utf8')
        vals['password'] = pw_hash_utf8

        new_patient = cls(**vals)

        db.session.add(new_patient)
        db.session.commit()
        return new_patient

    @classmethod
    def authenticate_patient(cls,username,password):
        patient = cls.query.filter_by(username = username).one_or_none()
        if patient:
            pw_hash = patient.password
            result = bcrypt.check_password_hash(pw_hash,password)
        else:
            result = False

        return result


    def delete_user(self):
        db.session.delete(self)
        db.session.commit()


    @classmethod
    def update_patient(cls,form,username):
            fieldnames = ['csrf_token','confirm_password']
            vals = {f'{f.name}': f.data for f in form if f.data and f.name not in fieldnames}

            if form.password.data:
                pw_hash = bcrypt.generate_password_hash(form.password.data)
                pw_hash_utf8 = pw_hash.decode('utf8')
                vals['password'] = pw_hash_utf8

            cls.query.filter_by(username=username).update(values={**vals})
            db.session.commit()
            
    @classmethod
    def add_doctor_to_patient(cls,patient,doctor_username):
        doctor = Healthcare_Professionals.query.filter_by(username = doctor_username).one()
        patient.doctors.append(doctor)
        db.session.commit()
        return [[d.username,d.fullname,d.license] for d in patient.doctors if d.title == 'Doctor']


class Admin (db.Model):
    __tablename__ = 'admins'

    def __repr__(self):
        'Shows information about an admin in a readable format'
        a = self
        return f'<id: {a.id}, username: {a.username}, name: {a.fullname}>'

    id = db.Column(
        db.Integer,
        primary_key = True,
        autoincrement = True
    )
    first_name = db.Column(
        db.String(50),
        nullable = False
    )
    last_name = db.Column(
        db.String(50),
        nullable = False
    )

    username = db.Column(
        db.String(30),
        unique = True,
        nullable = False
    )
    password = db.Column(
        db.Text,
        nullable = False
    )
    email = db.Column(
        db.String(100),
        unique = True,
        nullable = False
    )
    phone_number = db.Column(
        db.Text
    )

    @property
    def fullname(self):
        return f'{self.first_name} {self.last_name}'

    @property
    def is_admin(self):
        return True

    @property
    def is_non_hcp_admin(self):
        return True


    @classmethod
    def authenticate_Admin(cls,username,password):
        admin = cls.query.filter_by(username = username).one_or_none()
        if admin:
            pw_hash = admin.password
            result = bcrypt.check_password_hash(pw_hash,password)
        else:
            result = False
        return result

    @classmethod
    def update_admin(cls,form,username):
            fieldnames = ['csrf_token','confirm_password']
            vals = {f'{f.name}': f.data for f in form if f.data and f.name not in fieldnames}

            if form.password.data:
                pw_hash = bcrypt.generate_password_hash(form.password.data)
                pw_hash_utf8 = pw_hash.decode('utf8')
                vals['password'] = pw_hash_utf8

            cls.query.filter_by(username=username).update(values={**vals})
            db.session.commit()

    @classmethod
    def verify_hcp(cls,username):
        hcp = Healthcare_Professionals.query.filter_by(username=username).one()
        hcp.is_verified = True
        db.session.add(hcp)
        db.session.commit()

    @classmethod
    def make_admin(cls,username):
        hcp = Healthcare_Professionals.query.filter_by(username=username).one()
        hcp.is_admin = True
        db.session.add(hcp)
        db.session.commit()

    @classmethod
    def delete_user_by_username(cls,username,type):
        if type == 'hcp':
            user = Healthcare_Professionals.query.filter_by(username=username).one()
        else:
            user = Patient.query.filter_by(username=username).one()

        db.session.delete(user)
        db.session.commit()

    def delete_user(self):
        db.session.delete(self)
        db.session.commit()



class Healthcare_Professionals (db.Model):

    __tablename__ = 'healthcare_professionals'

    def __repr__(self):
        'Shows information about a healthcare professionals in a readable format'
        h = self
        return f'<id: {h.id}, username: {h.username}, name: {h.fullname}>'

    id = db.Column(
        db.Integer,
        primary_key = True,
        autoincrement = True
    )
    first_name = db.Column(
        db.String(50),
        nullable = False
    )
    last_name = db.Column(
        db.String(50),
        nullable = False
    )

    username = db.Column(
        db.String(30),
        unique = True,
        nullable = False
    )
    password = db.Column(
        db.Text,
        nullable = False
    )
    email = db.Column(
        db.String(100),
        unique = True,
        nullable = False
    )
    phone_number = db.Column(
        db.Text
    )
    title = db.Column(
        db.Text,
        nullable = False
    )
    license = db.Column(
        db.Text
    )
    is_verified = db.Column(
        db.Boolean,
        default = False,
        nullable = False
    )
    is_admin = db.Column(
        db.Boolean,
        default = False,
        nullable = False
    )
    institution_id = db.Column(
        db.Integer,
        db.ForeignKey('institutions.id'),
        default=None
    )



    @property
    def fullname(self):
        return f'{self.first_name} {self.last_name}'
    @property
    def is_doctor(self):
        return self.title == 'Doctor'

    @classmethod
    def newHCP(cls,form):
        fieldnames = ['csrf_token','confirm_password']
        vals = {f'{f.name}': f.data for f in form if f.data and f.name not in fieldnames}

        pw_hash = bcrypt.generate_password_hash(form.password.data)
        pw_hash_utf8 = pw_hash.decode('utf8')
        vals['password'] = pw_hash_utf8
        vals['institution_id'] = form.institution_id.data if form.institution_id.data > 0 else None

        new_hcp = cls(**vals)

        db.session.add(new_hcp)
        db.session.commit()
        return new_hcp

    @classmethod
    def authenticate_HCP(cls,username,password):
        healthcare_professional = cls.query.filter_by(username = username).one_or_none()
        if healthcare_professional:
            pw_hash = healthcare_professional.password
            result = bcrypt.check_password_hash(pw_hash,password)
        else:
            result = False
        return result


    def delete_user(self):
        db.session.delete(self)
        db.session.commit()


    @classmethod
    def update_hcp(cls,form,username):
            fieldnames = ['csrf_token','confirm_password']
            vals = {f'{f.name}': f.data for f in form if f.data and f.name not in fieldnames}

            if form.password.data:
                pw_hash = bcrypt.generate_password_hash(form.password.data)
                pw_hash_utf8 = pw_hash.decode('utf8')
                vals['password'] = pw_hash_utf8

            cls.query.filter_by(username=username).update(values={**vals})
            db.session.commit()

    @classmethod
    def add_patient_to_doctor(cls,doctor,patient_username):
        patient = Patient.query.filter_by(username=patient_username).one()
        doctor.patients.append(patient)
        db.session.commit()
        return [[p.username,p.fullname,p.birth_date] for p in doctor.patients]

    @classmethod
    def get_all_doctors_in_institution(cls,institution_id):
        all_doctors = cls.query.filter(and_(cls.title=='Doctor',cls.institution_id==institution_id)).all()
        return all_doctors

    def get_patient_assessments(self):
        all_doctors = Healthcare_Professionals.get_all_doctors_in_institution(self.institution_id)        

        all_assessments = []
        for doctor in all_doctors:
            all_assessments = [*all_assessments,*doctor.assessments]

        curr_user_assessments = Assessment.query.filter_by(completed_by_username=self.username).all()

        all_assessments = set([*all_assessments,*curr_user_assessments])
        all_assessments = list(all_assessments)

        all_assessments.sort(key=Healthcare_Professionals.sort_func)
        all_assessments.sort(key=Healthcare_Professionals.sort_func2)


        return list(all_assessments)

    def sort_func(i):
        return datetime.now()-i.datetime
    def sort_func2(i):
        return not i.follow_up_questions


    # Relationships
    patients = db.relationship(
        'Patient', secondary = 'patients_healthcare_professionals', backref = 'doctors'
    )

    
class Institution (db.Model):

    __tablename__ = 'institutions'

    def __repr__(self):
        'Shows information about an institution in a readable format'
        i = self
        return f'<id: {i.id}, {i.name}>'

    id = db.Column(
        db.Integer,
        primary_key = True,
        autoincrement = True
    )
    name = db.Column(
        db.String(100),
        nullable = False
    )
    address = db.Column(
        db.String(100),
        nullable = False
    )

    @classmethod
    def add_Institution(cls,name,address):
        new_institution = cls(name=name,address=address)
        db.session.add(new_institution)
        db.session.commit()
        return new_institution

    @classmethod
    def delete_Institution(cls,id):
        cls.query.filter_by(id=id).delete()
        db.session.commit()

    # Relationships
    healthcare_professionals = db.relationship('Healthcare_Professionals',backref='institution', passive_deletes=True)



class Patient_Healthcare_Professional (db.Model):

    __tablename__ = 'patients_healthcare_professionals'

    def __repr__(self):
        'Shows information about an institution in a readable format'
        i = self
        return f'<{i.patient_id} - {i.healthcare_professional_id}>'

    patient_id = db.Column(
        db.Integer,
        db.ForeignKey('patients.id',ondelete="CASCADE"),        
        primary_key = True
    )
    healthcare_professional_id = db.Column(
        db.Integer,
        db.ForeignKey('healthcare_professionals.id',ondelete="CASCADE"),
        primary_key = True
    )


    # Relationships
    patient = db.relationship('Patient',backref=db.backref('assignments',cascade="all, delete-orphan"), passive_deletes=True)
    healthcare_professional = db.relationship('Healthcare_Professionals',backref=db.backref('assignments',cascade="all, delete-orphan"), passive_deletes=True)


class Assessment (db.Model):

    __tablename__ = 'assessments'

    def __repr__(self):
        'Shows information about an assessment in a readable format'
        a = self
        return f'<id: {a.id}, Completed On: {a.datetime}, Patient: {a.patient_id}, Doctor: {a.doctor_id}>'

    id = db.Column(
        db.Text,
        primary_key = True
    )
    datetime = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.now()
    )
    patient_id = db.Column(
        db.Integer,
        db.ForeignKey('patients.id',ondelete="CASCADE")
    )
    doctor_id = db.Column(
        db.Integer,
        db.ForeignKey('healthcare_professionals.id',ondelete="CASCADE")
    )
    completed_by_username = db.Column(
        db.Text
    )
    chief_complaint = db.Column(
        db.Text
    )
    official_diagnosis = db.Column(
        db.Text
    )
    notes = db.Column(
        db.Text
    )
    follow_up_questions = db.Column(
        ARRAY(db.String),
        default = [],
        nullable=False
    )

    def add_Question(self,question_name,question_answer):
        new_question = Assessment_Questions(assessment_id=self.id,question_name=question_name,question_answer=question_answer)
        db.session.add(new_question)
        db.session.commit()
        return new_question
    def add_Multiple_Questions(self,questions_obj):
        for question in questions_obj:
            self.add_Question(question_name=question['question'],question_answer=question['answer'])

    def add_Suggested_Test(self,test_name):
        new_test = Assessment_Suggested_Test(assessment_id=self.id,test_name=test_name)
        db.session.add(new_test)
        db.session.commit()
        return new_test
    def add_Multiple_Suggested_Test(self,suggested_tests_obj):
        for test in suggested_tests_obj:
            self.add_Suggested_Test(test[0])

    def add_Potential_Diagnosis(self,diagnosis_name):
        new_potential_diagnosis = Assessment_Potential_Diagnosis(assessment_id=self.id,diagnosis_name=diagnosis_name)
        db.session.add(new_potential_diagnosis)
        db.session.commit()
        return new_potential_diagnosis
    def add_Multiple_Potential_Diagnoses(self,potential_diagnoses_obj):
        for disease in potential_diagnoses_obj:
            self.add_Potential_Diagnosis(disease)

    @classmethod
    def add_New_Assessment(cls,current_user,assessment_obj):
        patient = Patient.query.filter_by(username = assessment_obj['patient_username']).one()
        doctor = Healthcare_Professionals.query.filter_by(username = assessment_obj['doctor_username']).one()

        kwargs = {
            "id": assessment_obj['id'],
            "patient_id": patient.id,
            "doctor_id": doctor.id,
            "completed_by_username": current_user.username,
            "chief_complaint": assessment_obj['symptom_statement']
        }
        new_assessment = cls(**kwargs)
        db.session.add(new_assessment)
        db.session.commit()

        new_assessment.add_Multiple_Questions(assessment_obj['questions'])
        new_assessment.add_Multiple_Suggested_Test(assessment_obj['suggestions_tests'])
        new_assessment.add_Multiple_Potential_Diagnoses(assessment_obj['analysis_results'])
        return f'Assessment for {patient.fullname} has been successfully completed.'

    @classmethod
    def get_assessment_questions_from_assessment_obj(cls,assessment_obj):
        for q in assessment_obj["questions"]:
            question = q['question']
            answer = q['answer']

            q['name'] = question

            d = GetQuestions.get_question_by_name(question)

            if d['type'] == 'categorical':
                choices = d['choices']
                choice = [(c.get('text'),c.get('laytext')) for c in choices if str(c.get('value'))==str(answer)]                            

                if isinstance(g.user,Healthcare_Professionals):
                    question = d['text']
                    answer = choice[0][0] if len(choice) > 0 else None 
                else:
                    question = d['laytext']
                    answer = choice[0][1] if len(choice) > 0 else None 

                q['question'] = question                            
                q['answer'] = answer
            else:
                if isinstance(g.user,Healthcare_Professionals):
                    question = d['text']
                else:
                    question = d['laytext']

                q['question'] = question                            


    @classmethod
    def delete_by_id(cls,assessment_id):
        asessment = Assessment.query.filter_by(id=assessment_id).delete()
        db.session.commit()

    @classmethod
    def add_follow_up_question(cls,assessment_id,question):
        assessment = cls.query.filter_by(id=assessment_id).one()
        question_list = assessment.follow_up_questions
        if question not in question_list:
            question_list.append(question)
            cls.query.filter_by(id=assessment_id).update(values={'follow_up_questions':question_list})
            db.session.commit()

        return assessment

    @classmethod
    def remove_follow_up_question(cls,assessment_id,question):
        assessment = cls.query.filter_by(id=assessment_id).one()
        question_list = assessment.follow_up_questions
        if question in question_list:
            question_list.remove(question)
            cls.query.filter_by(id=assessment_id).update(values={'follow_up_questions':question_list})
            db.session.commit()

        return assessment


    def get_assessment_questions(self):
        questions = []

        for q in self.questions:
            question = q.question_name
            name = question
            answer = q.question_answer

            d = GetQuestions.get_question_by_name(question)

            if d['type'] == 'categorical':
                choices = d['choices']
                choice = [(c.get('text'),c.get('laytext')) for c in choices if str(c.get('value'))==str(answer)]                            

                if isinstance(g.user,Healthcare_Professionals):
                    question = d['text']
                    answer = choice[0][0] if len(choice) > 0 else None 
                    questions.append({"question": question,"answer": answer,"name":name})
                else:
                    question = d['laytext']
                    answer = choice[0][1] if len(choice) > 0 else None 
                    questions.append({"question": question,"answer": answer,"name":name})

            else:
                if isinstance(g.user,Healthcare_Professionals):
                    question = d['text']
                    questions.append({"question": question,"answer": answer,"name":name})
                else:
                    question = d['laytext']
                    questions.append({"question": question,"answer": answer,"name":name})

        return questions


    def get_suggested_tests(self):
        suggested_tests = []

        for t in self.suggested_tests:
            test_name = t.test_name
            d = GetQuestions.get_question_by_name(test_name)
            suggested_tests.append([test_name,d['text']])

        return suggested_tests


    def review(self,notes,official_diagnosis):
        self.notes = notes
        self.official_diagnosis = official_diagnosis
        db.session.add(self)
        db.session.commit()


    # Relationships
    patient = db.relationship('Patient',backref=db.backref('assessments',cascade="all, delete-orphan"), passive_deletes=True)
    doctor = db.relationship('Healthcare_Professionals',backref=db.backref('assessments',cascade="all, delete-orphan"), passive_deletes=True)


class Assessment_Questions (db.Model):

    __tablename__ = 'assessment_questions'

    def __repr__(self):
        'Shows information about an assessment_question in a readable format'
        a = self
        return f'<id: {a.assessment_id}, Name: {a.question_name}, Answer: {a.question_answer}>'

    assessment_id = db.Column(
        db.Text,
        db.ForeignKey('assessments.id',ondelete="CASCADE"),
        primary_key = True
    )
    question_name = db.Column(
        db.Text,
        primary_key = True
    )
    question_answer = db.Column(
        db.Text
    )

    @classmethod
    def update_assessment_question(cls,assessment_id,question_name,answer):
        question = cls.query.filter_by(assessment_id=assessment_id,question_name=question_name).one_or_none()
        question.question_answer = answer

        db.session.add(question)
        db.session.commit()

    @classmethod
    def add_assessment_question(cls,assessment_id,question_name,answer):
        question = cls(assessment_id=assessment_id,question_name=question_name,question_answer=answer)
        db.session.add(question)
        db.session.commit()


    @classmethod
    def delete_question(cls,assessment_id,question_name):
        question = cls.query.filter_by(assessment_id=assessment_id,question_name=question_name).one_or_none()
        if question:
            db.session.delete(question)
            db.session.commit()
            return True
        else:
            return False

    # Relationships
    assessment = db.relationship('Assessment',backref='questions', passive_deletes=True)

class Assessment_Suggested_Test (db.Model):

    __tablename__ = 'assessment_suggested_tests'

    def __repr__(self):
        'Shows information about an assessment_suggested_test in a readable format'
        a = self
        return f'<id: {a.assessment_id}, Name: {a.test_name}>'

    assessment_id = db.Column(
        db.Text,
        db.ForeignKey('assessments.id',ondelete="CASCADE"),
        primary_key = True
    )
    test_name = db.Column(
        db.Text,
        primary_key = True
    )

    # Relationships
    assessment = db.relationship('Assessment',backref='suggested_tests', passive_deletes=True)

class Assessment_Potential_Diagnosis (db.Model):

    __tablename__ = 'assessment_potential_diagnoses'

    def __repr__(self):
        'Shows information about an assessment_potential_diagnosis in a readable format'
        a = self
        return f'<id: {a.assessment_id}, Name: {a.diagnosis_name}>'

    assessment_id = db.Column(
        db.Text,
        db.ForeignKey('assessments.id',ondelete="CASCADE"),
        primary_key = True
    )
    diagnosis_name = db.Column(
        db.Text,
        primary_key = True
    )

    # Relationships
    assessment = db.relationship('Assessment',backref='potential_diagnoses', passive_deletes=True)


class GetQuestions:
    val_num = 0
    @classmethod
    def get_question_by_name(cls,name):
        with open('SymptomsOutput.json') as file: 
            data = json.load(file)

            val = get_item_log_n(data,name)
            return val


    @classmethod
    def get_filtered_questions(cls,input_list):
        user_type = 'hcp' if isinstance(g.user,Healthcare_Professionals) else None

        if user_type == 'hcp':
            with open('SymptomsOutput.json') as file: 
                data = json.load(file)

                return [(i.get("name"),i.get("text")) for i in data if cls.check_if_in(i.get("laytext"),input_list) or cls.check_if_in(i.get("text"),input_list)]
        else:
            with open('SymptomsOutput.json') as file: 
                data = json.load(file)

                return [(i.get("name"),i.get("laytext")) for i in data if i.get("IsPatientProvided") and (cls.check_if_in(i.get("laytext"),input_list) or cls.check_if_in(i.get("text"),input_list))]

    @classmethod
    def check_if_in(cls,input_text,input_list):
        for search_query in input_list:
            if search_query in input_text.lower():
                return True
        return False

    @classmethod
    def filter_questions(cls,request_obj):
        answered_questions = []
        if session.get("assessment"):
            answered_questions = [q['question'] for q in session.get("assessment").get('questions')]

        if request_obj["filter_query"] == "All Questions":
            if isinstance(g.user,Healthcare_Professionals):
                with open('SymptomsOutput.json') as file: 
                    data = json.load(file)
                    result_questions = [(q["name"],q["text"]) for q in data if q["name"] not in answered_questions]
            else:
                with open('SymptomsOutput.json') as file: 
                    data = json.load(file)
                    result_questions = [(q["name"],q["laytext"]) for q in data if q["IsPatientProvided"] and q["name"] not in answered_questions]
            res = make_response(jsonify({'message': f'Updated stats All Questions','result_questions':result_questions}),200)

        elif request_obj["filter_query"] == "Other":
            if isinstance(g.user,Healthcare_Professionals):
                with open('SymptomsOutput.json') as file: 
                    data = json.load(file)
                    result_questions = [(q["name"],q["text"]) for q in data if (request_obj["search_phrase"].lower() in q["laytext"].lower() or  request_obj["search_phrase"].lower() in q["text"].lower()) and q["name"] not in answered_questions]
            else:
                with open('SymptomsOutput.json') as file: 
                    data = json.load(file)
                    result_questions = [(q["name"],q["laytext"]) for q in data if q["IsPatientProvided"] and (request_obj["search_phrase"].lower() in q["laytext"].lower() or  request_obj["search_phrase"].lower() in q["text"].lower()) and q["name"] not in answered_questions]
            res = make_response(jsonify({'message': f'Updated stats All Questions','result_questions':result_questions}),200)
        else:
            with open('symptomslist.json') as file: 
                data = json.load(file)
                item = None
                for i in data:
                    if isinstance(i,dict):
                        if i.get("label") == request_obj["filter_query"]:
                            item = i
                if item.get("search"):
                    result_questions = cls.get_filtered_questions(item.get("search"))
                    result_questions = [(k,v) for k,v in result_questions if k not in answered_questions]
                    if result_questions == []:
                        result_questions = [("None","None")]
                else:
                    result_questions = None
            res = make_response(jsonify({'message': f'Updated stats {item.get("search")}','result_questions':result_questions}),200)
        return res


class API_Requests:
    @classmethod
    def get_assessment_id(cls):
        api_link = api_base_url
        r = requests.get(f'{api_link}/InitSession')
        sessionID = r.json().get('SessionID')
        if API_Requests.AcceptTermsOfUse(sessionID):
            print('////////////////////',sessionID,'///////////////////')
            return sessionID
        else:
            return None

    @classmethod
    def AcceptTermsOfUse(cls,sessionID):
        api_link = api_base_url
        passphrase = "I have read, understood and I accept and agree to comply with the Terms of Use of EndlessMedicalAPI and Endless Medical services. The Terms of Use are available on endlessmedical.com"
        paramStr = f"?SessionID={sessionID}&passphrase={passphrase}"

        r = requests.post(f'{api_link}/AcceptTermsOfUse{paramStr}')
        status = r.json().get('status')
        if status == 'ok':
            return True
        else:
            return False

    @classmethod
    def UpdateQuestion(cls,session,name,value):
        sessionID = session.get('assessment').get('id')

        api_link = api_base_url
        query = f"?SessionID={sessionID}&name={name}&value={value}"

        r = requests.post(f'{api_link}/UpdateFeature{query}')
        status = r.json().get('status')
        print(f'////////////////////////////STATUS:{status} ----- {r.json()}')
        suggestions = API_Requests.GetSuggestedQuestion(sessionID)
        return suggestions

    @classmethod
    def GetSuggestedQuestion(cls,sessionID):
        api_link = api_base_url
        query = f"?SessionID={sessionID}"
        user_type = 'hcp' if isinstance(g.user,Healthcare_Professionals) else None

        if user_type == 'hcp':
            r = requests.get(f'{api_link}/GetSuggestedFeatures_PhysicianProvided{query}')
        else:
            r = requests.get(f'{api_link}/GetSuggestedFeatures_PatientProvided{query}')

        return r.json().get("SuggestedFeatures")

    @classmethod
    def GetSuggestedTests(cls,sessionID):
        api_link = api_base_url
        query = f"?SessionID={sessionID}"

        r = requests.get(f'{api_link}/GetSuggestedFeatures_Tests{query}')

        return r.json().get("SuggestedFeatures")

    @classmethod
    def Analyze(cls,sessionID):
        api_link = api_base_url
        query = f"?SessionID={sessionID}"

        r = requests.get(f'{api_link}/Analyze{query}')
        return r.json()

    @classmethod
    def DeleteQuestion(cls,assessment_id,question_name):
        sessionID = assessment_id

        api_link = api_base_url
        query = f"?SessionID={sessionID}&name={question_name}"

        r = requests.post(f'{api_link}/DeleteFeature{query}')
        status = r.json().get('status')
        print(f'////////////////////////////STATUS:{status} ----- {r.json()}')
        suggestions = API_Requests.GetSuggestedQuestion(sessionID)
        return suggestions


def get_item_log_n(data_list,name):
    left_idx = 0
    right_idx = len(data_list)-1
    mid_idx = (left_idx+right_idx)//2
    mid_val = data_list[mid_idx]
    found = False
    val = None

    while not found and left_idx <= right_idx:
        if f'{name}' == f'{mid_val.get("name")}':
            found = True
            val = mid_val
            return val
        elif f'{name}' > f'{mid_val.get("name")}':
            left_idx = mid_idx + 1
        elif f'{name}' < f'{mid_val.get("name")}':
            right_idx = mid_idx - 1
        mid_idx = (left_idx+right_idx)//2
        mid_val = data_list[mid_idx]

    return val
