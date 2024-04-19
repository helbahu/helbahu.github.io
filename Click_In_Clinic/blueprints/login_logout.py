from flask import Blueprint, render_template,redirect,flash, g,request,session
from models import Healthcare_Professionals,Patient,Admin
from forms import LogIn_Admin,LogIn,LogIn_HCP

login_logout_bp = Blueprint('login_logout',__name__,template_folder='/templates')

# User signup/login/logout
CURR_USER_KEY = "username"

def do_login(user):
    """Log in user."""

    session[CURR_USER_KEY] = user.username

@login_logout_bp.route('/login/admin',methods=['GET','POST'])
def login_admin_user():
    if g.user:
        username = g.user.username
        return redirect(f'/users/{username}')

    session['user_type'] = 'admin'

    form = LogIn_Admin()

    if form.validate_on_submit():
        # NOTE: Authentication has been done in forms using a custom validator.
        user = Admin.query.filter_by(username = form.username.data).one()
        session['user_type'] = 'admin'

        do_login(user)

        flash(f'Welcome {user.fullname}','success')
        return redirect(f'/users/{user.username}')


    return render_template('login.html',form=form)


@login_logout_bp.route('/login',methods=['GET','POST'])
def login_user():
    if g.user:
        username = g.user.username
        return redirect(f'/users/{username}')

    if request.args.get('user_type'):
        session['user_type'] = request.args.get("user_type")
        return redirect('/login')
        
    if session.get('user_type') == 'hcp':
        form = LogIn_HCP()

        if form.validate_on_submit():
            # NOTE: Authentication has been done in forms using a custom validator.
            user = Healthcare_Professionals.query.filter_by(username = form.username.data).one()
            do_login(user)
            flash(f'Welcome {user.fullname}','success')            
            return redirect(f'/users/{user.username}')

    else:
        form = LogIn()

        if form.validate_on_submit():
            # NOTE: Authentication has been done in forms using a custom validator.
            user = Patient.query.filter_by(username = form.username.data).one()
            session['user_type'] = 'patient'
            do_login(user)

            flash(f'Welcome {user.fullname}','success')
            return redirect(f'/users/{user.username}')

    return render_template('login.html',form=form)

@login_logout_bp.route('/logout')
def logout():
    session.clear()
    flash('Goodbye','info')
    return redirect('/')
