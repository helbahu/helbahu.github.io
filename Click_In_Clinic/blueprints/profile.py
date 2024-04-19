from flask import Blueprint, render_template,redirect,flash, g,session
from models import Healthcare_Professionals,Patient,Admin,Institution
from forms import HCP_Update,Admin_Update,Patient_Update

profile_bp = Blueprint('profile',__name__,template_folder='/templates')


@profile_bp.route('/users/<username>')
def profile_page(username):
    if not g.user or g.user.username != username:
        return redirect('/register')
        
    if session.get('assessment'):
        del session["assessment"]

    return render_template('profile.html')


@profile_bp.route('/users/<username>/delete',methods=['POST'])
def delete_user(username):
    if not g.user or g.user.username != username:
        return redirect('/register')

    g.user.delete_user()

    session.clear()
    flash(f'The user {username} was deleted successfully!','success')
    return redirect('/')


@profile_bp.route('/users/<username>/edit',methods=['GET','POST'])
def edit_user(username):
    if not g.user or g.user.username != username:
        return redirect('/register')

    if isinstance(g.user,Healthcare_Professionals):
        healthcare_professional = g.user
        form = HCP_Update(obj=healthcare_professional)
        choices = [(i.id,i.name) for i in Institution.query.all()]
        form.institution_id.choices = [(-1,'None'),*choices]

        if form.validate_on_submit():
            Healthcare_Professionals.update_hcp(form,username)
            session['username'] = healthcare_professional.username

            flash(f'User information for {healthcare_professional.fullname} was updated successfully','success')
            return redirect(f'/users/{healthcare_professional.username}')

    elif isinstance(g.user,Admin):
        admin = g.user
        form = Admin_Update(obj=admin)

        if form.validate_on_submit():

            Admin.update_admin(form,username)
            session['username'] = admin.username
            # session['user_type'] = 'admin'

            flash(f'User information for {admin.fullname} was updated successfully','success')
            return redirect(f'/users/{admin.username}')
    
    else:
        patient = g.user
        form = Patient_Update(obj=patient)

        if form.validate_on_submit():
            Patient.update_patient(form,username)
            session['username'] = patient.username
            # session['user_type'] = 'patient'

            flash(f'User information for {patient.fullname} was updated successfully','success')
            return redirect(f'/users/{patient.username}')

    return render_template('update_user.html',form=form,username=username)
