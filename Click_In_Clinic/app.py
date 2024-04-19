import os
from dotenv import load_dotenv

from flask import Flask, request, redirect, render_template, flash, session, g
from flask import jsonify,make_response
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Patient, Healthcare_Professionals, Admin, Institution, GetQuestions, API_Requests, Assessment,Assessment_Questions, get_item_log_n

from forms import LogIn, LogIn_HCP,LogIn_Admin, PatientSignUp, HCP_SignUp,HCP_Update,Patient_Update, SymptomForm, SymptomForm_suggested_questions, SymptomForm_add_more_symptoms, Add_Doctor, Admin_Update,ReviewAssessmentForm,SettingsForm, AddInstitutionForm

import json

# Load variables from .env file
load_dotenv()

database_url = os.getenv('CLICK_IN_CLINIC_DATABASE')
secret_key = os.getenv('SECRET_KEY')

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] =database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

app.config['SECRET_KEY'] = secret_key
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

#ensures debugging is activated
# app.debug = True

debug = DebugToolbarExtension(app)


connect_db(app)
# with app.app_context():
#     db.drop_all()
#     db.create_all()


# User signup/login/logout
CURR_USER_KEY = "username"


# BLUEPRINTS IMPORT
from blueprints.register import register_bp
app.register_blueprint(register_bp)

from blueprints.login_logout import login_logout_bp
app.register_blueprint(login_logout_bp)

from blueprints.profile import profile_bp
app.register_blueprint(profile_bp)

from blueprints.assessments import assessments_bp
app.register_blueprint(assessments_bp)

from blueprints.assessment_review_followup import review_bp
app.register_blueprint(review_bp)

from blueprints.assessment_forms import assessment_bp
app.register_blueprint(assessment_bp)

from blueprints.assessment_questions import questions_bp
app.register_blueprint(questions_bp)

from blueprints.admin_functionality import admin_bp
app.register_blueprint(admin_bp)

from blueprints.settings import settings_bp
app.register_blueprint(settings_bp)

from blueprints.user_ajax_requests import user_requests_bp
app.register_blueprint(user_requests_bp)

from blueprints.question_ajax_requests import question_requests_bp
app.register_blueprint(question_requests_bp)


@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""
    
    if CURR_USER_KEY in session:
        if session.get('user_type') == 'hcp':
            g.user = Healthcare_Professionals.query.filter_by(username = session[CURR_USER_KEY]).one_or_none()
        elif session.get('user_type') == 'admin':
            g.user = Admin.query.filter_by(username = session[CURR_USER_KEY]).one_or_none()
        else:
            g.user = Patient.query.filter_by(username = session[CURR_USER_KEY]).one_or_none()

    else:
        g.user = None


@app.route('/')
def homepage():
    return render_template('homepage.html')



