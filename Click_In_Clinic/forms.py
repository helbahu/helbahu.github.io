from typing import Any
from flask_wtf import FlaskForm
from flask import session
from models import db,Patient,Healthcare_Professionals,Admin
from wtforms import StringField, IntegerField, SelectField,TextAreaField, FileField, EmailField, PasswordField,TelField, DateField
from wtforms.validators import InputRequired, Optional, URL, NumberRange, ValidationError, Length, EqualTo, NoneOf


# SIGNUP PATIENT FORM -------------------------------------------------------------------- SIGNUP PATIENT FORM
def unique_username(form,field):
    all_patient_usernames = [u.username for u in Patient.query.all() if u.username != session.get('username')]
    all_HCP_usernames =  [u.username for u in Healthcare_Professionals.query.all() if u.username != session.get('username')]
    all_admin_usernames =  [u.username for u in Admin.query.all() if u.username != session.get('username')]

    all_usernames = [*all_patient_usernames,*all_HCP_usernames,*all_admin_usernames]

    if field.data in all_usernames:
        uniqueUsername = 'Username already exists.'
        raise ValidationError(uniqueUsername)

def unique_email(form,field):
    all_patient_emails = [u.email for u in Patient.query.all() if u.username != session.get('username')]
    all_HCP_emails =  [u.email for u in Healthcare_Professionals.query.all() if u.username != session.get('username')]
    all_admin_emails = [u.email for u in Admin.query.all() if u.username != session.get('username')]

    all_emails = [*all_patient_emails,*all_HCP_emails,*all_admin_emails]
    if field.data in all_emails:
        uniqueEmail = 'Email address already in use.'
        raise ValidationError(uniqueEmail)

class PatientSignUp (FlaskForm):
    # Messages
    uniqueUsername = 'Username already exists.'
    passwordsMatch = 'Passwords must match'
    passwordLength = 'The password must be at least 6 characters in length.'
    nameInputLength = 'Name must be between 1 and 50 characters long'
    emailInputLength = 'Email address must be between 1 and 100 characters long'
    usernameInputLength = 'Username must be between 1 and 30 characters long'


    first_name = StringField("First Name",validators=[InputRequired(), Length(min=1,max=30, message=nameInputLength)])
    last_name = StringField("Last Name",validators=[InputRequired(), Length(min=1,max=30, message=nameInputLength)])
    email = EmailField("Email",validators=[InputRequired(), Length(min=1,max=50,message=emailInputLength),unique_email])
    username = StringField("Username",validators=[InputRequired(), Length(min=1,max=20,message=usernameInputLength),unique_username])
    phone_number = TelField("Phone Number",validators=[Optional()])
    birth_date = DateField("Birth Date",validators=[InputRequired()])
    sex = SelectField("Sex",choices=[('Female','Female'),('Male','Male')])
    password = PasswordField("Password",validators=[InputRequired(),EqualTo('confirm_password',message=passwordsMatch), Length(min=6,message=passwordLength)])
    confirm_password = PasswordField("Re-enter Password",validators=[InputRequired()])


# HCP SIGNUP FORM ---------------------------------------------------------------------------- HCP SIGNUP FORM
class license_required_if_doctor:
    is_doctor = ''

    def __call__(self, form, field):
        if field.name == 'title':
            if field.data == 'Doctor':
                license_required_if_doctor.is_doctor = True
            else:
                license_required_if_doctor.is_doctor = False

        elif field.name == 'license':
            if not field.data and license_required_if_doctor:
                msg = 'License field is required for doctors.'
                raise ValidationError(msg)


class HCP_SignUp (FlaskForm):
    # Messages
    uniqueUsername = 'Username already exists.'
    passwordsMatch = 'Passwords must match'
    passwordLength = 'The password must be at least 6 characters in length.'
    nameInputLength = 'Name must be between 1 and 50 characters long'
    licInputLength = 'License number must be less than 20 characters long'
    emailInputLength = 'Email address must be between 1 and 100 characters long'
    usernameInputLength = 'Username must be between 1 and 30 characters long'


    first_name = StringField("First Name",validators=[InputRequired(), Length(min=1,max=30, message=nameInputLength)])
    last_name = StringField("Last Name",validators=[InputRequired(), Length(min=1,max=30, message=nameInputLength)])
    email = EmailField("Email",validators=[InputRequired(), Length(min=1,max=50,message=emailInputLength),unique_email])
    title = SelectField("Title",choices=[(t,t) for t in ['Doctor','Nurse','Pharmacist','Social Worker','Physician Assistant','Other']],validators=[license_required_if_doctor()])
    license = StringField("License",validators=[Length(max=30, message=licInputLength),license_required_if_doctor()])
    institution_id = SelectField("Institution",coerce=int)
    username = StringField("Username",validators=[InputRequired(), Length(min=1,max=20,message=usernameInputLength),unique_username])
    phone_number = TelField("Phone Number",validators=[Optional()])
    password = PasswordField("Password",validators=[InputRequired(),EqualTo('confirm_password',message=passwordsMatch), Length(min=6,message=passwordLength)])
    confirm_password = PasswordField("Re-enter Password",validators=[InputRequired()])


def length_or_none(form,field):
    txt = field.data
    if len(txt) < 6 and len(txt) != 0:
        msg = 'The password must be at least 6 characters in length.'
        raise ValidationError(msg)

class Patient_Update (FlaskForm):
    # Messages
    uniqueUsername = 'Username already exists.'
    passwordsMatch = 'Passwords must match'
    passwordLength = 'The password must be at least 6 characters in length.'
    nameInputLength = 'Name must be between 1 and 50 characters long'
    emailInputLength = 'Email address must be between 1 and 100 characters long'
    usernameInputLength = 'Username must be between 1 and 30 characters long'


    first_name = StringField("First Name",validators=[InputRequired(), Length(min=1,max=30, message=nameInputLength)])
    last_name = StringField("Last Name",validators=[InputRequired(), Length(min=1,max=30, message=nameInputLength)])
    email = EmailField("Email",validators=[InputRequired(), Length(min=1,max=50,message=emailInputLength),unique_email])
    username = StringField("Username",validators=[InputRequired(), Length(min=1,max=20,message=usernameInputLength),unique_username])
    phone_number = TelField("Phone Number",validators=[Optional()])
    birth_date = DateField("Birth Date",validators=[InputRequired()])
    sex = SelectField("Sex",choices=[('Female','Female'),('Male','Male')])
    password = PasswordField("Password",validators=[EqualTo('confirm_password',message=passwordsMatch), length_or_none])
    confirm_password = PasswordField("Re-enter Password")

class Admin_Update(FlaskForm):
    # Messages
    uniqueUsername = 'Username already exists.'
    passwordsMatch = 'Passwords must match'
    passwordLength = 'The password must be at least 6 characters in length.'
    nameInputLength = 'Name must be between 1 and 50 characters long'
    emailInputLength = 'Email address must be between 1 and 100 characters long'
    usernameInputLength = 'Username must be between 1 and 30 characters long'

    first_name = StringField("First Name",validators=[InputRequired(), Length(min=1,max=30, message=nameInputLength)])
    last_name = StringField("Last Name",validators=[InputRequired(), Length(min=1,max=30, message=nameInputLength)])
    email = EmailField("Email",validators=[InputRequired(), Length(min=1,max=50,message=emailInputLength),unique_email])
    username = StringField("Username",validators=[InputRequired(), Length(min=1,max=20,message=usernameInputLength),unique_username])
    phone_number = TelField("Phone Number",validators=[Optional()])
    password = PasswordField("Password",validators=[EqualTo('confirm_password',message=passwordsMatch), length_or_none])
    confirm_password = PasswordField("Re-enter Password")


class HCP_Update (FlaskForm):

    # Messages
    uniqueUsername = 'Username already exists.'
    passwordsMatch = 'Passwords must match'
    nameInputLength = 'Name must be between 1 and 50 characters long'
    licInputLength = 'License number must be less than 20 characters long'
    emailInputLength = 'Email address must be between 1 and 100 characters long'
    usernameInputLength = 'Username must be between 1 and 30 characters long'

    first_name = StringField("First Name",validators=[InputRequired(), Length(min=1,max=30, message=nameInputLength)])
    last_name = StringField("Last Name",validators=[InputRequired(), Length(min=1,max=30, message=nameInputLength)])
    email = EmailField("Email",validators=[InputRequired(), Length(min=1,max=50,message=emailInputLength),unique_email])
    title = SelectField("Title",choices=[(t,t) for t in ['Doctor','Nurse','Pharmacist','Social Worker','Physician Assistant','Other']],validators=[license_required_if_doctor()])
    license = StringField("License",validators=[Length(max=30, message=licInputLength),license_required_if_doctor()])
    institution_id = SelectField("Institution",coerce=int)
    username = StringField("Username",validators=[InputRequired(), Length(min=1,max=20,message=usernameInputLength),unique_username])
    phone_number = TelField("Phone Number",validators=[Optional()])
    password = PasswordField("Password",validators=[EqualTo('confirm_password',message=passwordsMatch), length_or_none])
    confirm_password = PasswordField("Re-enter Password")



# LOGIN FORM ---------------------------------------------------------------------------- LOGIN FORM
class Authenticate_Login:
    user = ''

    def __call__(self, form, field):
        if field.name == 'username':
            all_patient_usernames = [u.username for u in Patient.query.all()]

            if field.data not in all_patient_usernames:
                usernameMsg = 'Invalid Username.'
                raise ValidationError(usernameMsg)
            else:
                Authenticate_Login.user = field.data

        elif field.name == 'password':
            username = Authenticate_Login.user
            result = Patient.authenticate_patient(username=username,password=field.data)

            if not result:
                pwMsg = 'Invalid Password.'
                raise ValidationError(pwMsg)
            else:
                Authenticate_Login.user = ''


class Authenticate_Login_HCP:
    user = ''

    def __call__(self, form, field):
        if field.name == 'username':
            all_HCP_usernames =  [u.username for u in Healthcare_Professionals.query.all()]

            if field.data not in all_HCP_usernames:
                usernameMsg = 'Invalid Username.'
                raise ValidationError(usernameMsg)
            else:
                Authenticate_Login.user = field.data

        elif field.name == 'password':
            username = Authenticate_Login.user
            result = Healthcare_Professionals.authenticate_HCP(username=username,password=field.data)

            if not result:
                pwMsg = 'Invalid Password.'
                raise ValidationError(pwMsg)
            else:
                Authenticate_Login.user = ''

class Authenticate_Login_Admin:
    user = ''
    
    def __call__(self, form, field):
        if field.name == 'username':
            all_Admin_usernames = [u.username for u in Admin.query.all()]

            if field.data not in all_Admin_usernames:
                usernameMsg = 'Invalid Username.'
                raise ValidationError(usernameMsg)
            else:
                Authenticate_Login_Admin.user = field.data                    

        elif field.name == 'password':
            username = Authenticate_Login_Admin.user

            result = Admin.authenticate_Admin(username=username,password=field.data)

            if not result:
                pwMsg = 'Invalid Password.'
                raise ValidationError(pwMsg)
            else:
                Authenticate_Login_Admin.user = ''


class LogIn (FlaskForm):
    username = StringField("Username",validators=[InputRequired(), Authenticate_Login()])
    password = PasswordField("Password",validators=[InputRequired(), Authenticate_Login()])

class LogIn_HCP (FlaskForm):
    username = StringField("Username",validators=[InputRequired(), Authenticate_Login_HCP()])
    password = PasswordField("Password",validators=[InputRequired(), Authenticate_Login_HCP()])

class LogIn_Admin (FlaskForm):
    username = StringField("Username",validators=[InputRequired(), Authenticate_Login_Admin()])
    password = PasswordField("Password",validators=[InputRequired(), Authenticate_Login_Admin()])


def required_input(form,field):
    txt = field.data
    if txt == "None":
        msg = 'Please select the name of the patient the assement is for.'
        raise ValidationError(msg)

class SymptomForm (FlaskForm):
    patient_name = SelectField("Patient",coerce=str,validators=[required_input])
    symptoms = TextAreaField("Describe your symptoms", validators=[InputRequired(), Length(max=100,message='Max length of prompt must be less than 100 characters.')])
    symptomList = SelectField("Symptoms",coerce=str) 
    questions = SelectField("Question",coerce=str)
    answer = StringField("Answer", validators=[InputRequired()])


class SymptomForm_suggested_questions(FlaskForm):
    questions = SelectField("Question",coerce=str)
    answer = StringField("Answer", validators=[InputRequired()])

class SymptomForm_add_more_symptoms(FlaskForm):
    symptomList = SelectField("Symptoms",coerce=str) 
    questions = SelectField("Question",coerce=str)
    answer = StringField("Answer", validators=[InputRequired()])

class Add_Doctor(FlaskForm):
    doctor_name = SelectField("Doctor",coerce=str) 

# Review Assessment Form
class ReviewAssessmentForm(FlaskForm):
    notes = TextAreaField("Doctor Notes", validators=[InputRequired()])
    official_diagnosis = SelectField("Diagnosis",coerce=str)
    symptomList = SelectField("Symptoms",coerce=str) 
    questions = SelectField("Question",coerce=str)

# SETTINGS FORM
class SettingsForm(FlaskForm):
    theme = SelectField("Theme",choices=[('success','Green'),('info','Light-Green'),*[(t.lower(),t) for t in ['Light','Dark','Primary','Secondary']]],validators=[license_required_if_doctor()])

class AddInstitutionForm(FlaskForm):
    name = StringField("Name of Institution",validators=[InputRequired()])
    address = StringField("Address",validators=[InputRequired()])



