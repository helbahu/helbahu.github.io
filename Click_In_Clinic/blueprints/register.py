from flask import Blueprint, render_template,redirect,flash, g,request,session
from models import Healthcare_Professionals,Institution,Patient
from forms import HCP_SignUp,PatientSignUp

register_bp = Blueprint('register',__name__,template_folder='/templates')

# User signup/login/logout
CURR_USER_KEY = "username"

def do_login(user):
    """Log in user."""

    session[CURR_USER_KEY] = user.username


@register_bp.route('/register',methods=['GET','POST'])
def register_user():
    if g.user:
        username = g.user.username
        return redirect(f'/users/{username}')

    if request.args.get('user_type'):
        session['user_type'] = request.args.get("user_type")
        return redirect('/register')

    if session.get('user_type') == 'hcp':

        form = HCP_SignUp()
        choices = [(i.id,i.name) for i in Institution.query.all()]
        form.institution_id.choices = [(-1,'None'),*choices]

        if form.validate_on_submit():
            new_HCP = Healthcare_Professionals.newHCP(form)
            do_login(new_HCP)

            flash(f'Welcome {new_HCP.fullname}','success')
            return redirect(f'/users/{new_HCP.username}')
    else:
        if session.get('user_type') == 'admin':
            session['user_type'] = 'patient'

        form = PatientSignUp()

        if form.validate_on_submit():
            new_patient = Patient.newPatient(form)
            session['user_type'] = 'patient'
            do_login(new_patient)

            flash(f'Welcome {new_patient.fullname}','success')
            return redirect(f'/users/{new_patient.username}')

    return render_template('registration.html',form=form)

