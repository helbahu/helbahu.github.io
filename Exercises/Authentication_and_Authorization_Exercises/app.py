from flask import Flask, request, redirect, render_template, flash, session
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User, Feedback

from forms import SignUp, LogIn, FeedbackForm

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///flask_feedback_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

app.config['SECRET_KEY'] = 'bloglyappSecretKey123'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

#ensures debugging is activated
# app.debug = True

debug = DebugToolbarExtension(app)

connect_db(app)

@app.route('/')
def homepage():
    return redirect('/register')

@app.route('/register',methods=['GET','POST'])
def register_user():
    if session.get('username'):
        username = session.get('username')
        return redirect(f'/users/{username}')

    form = SignUp()

    if form.validate_on_submit():
        fieldnames = ['csrf_token','confirm_password']
        vals = {f'{f.name}': f.data for f in form if f.data and f.name not in fieldnames}

        new_user = User.newUser(**vals)

        session['username'] = new_user.username

        flash(f'Welcome {new_user.fullname}','success')
        return redirect(f'/users/{new_user.username}')

    return render_template('registration.html',form=form)


@app.route('/users/<username>')
def secret_page(username):
    if session.get('username') == username:
        user = User.query.filter_by(username = username).one()
        return render_template('secret.html',user=user)
    else:
        return redirect('/register')

@app.route('/login',methods=['GET','POST'])
def login_user():
    if session.get('username'):
        username = session.get('username')
        return redirect(f'/users/{username}')


    form = LogIn()

    if form.validate_on_submit():
        # NOTE: Authentication has been done in forms using a custom validator.
        user = User.query.filter_by(username = form.username.data).one()
        session['username'] = user.username
        flash(f'Welcome {user.fullname}','success')
        return redirect(f'/users/{user.username}')

    return render_template('login.html',form=form)


@app.route('/logout')
def logout():
    session.clear()
    flash('Goodbye','info')
    return redirect('/')
 

@app.route('/users/<username>/feedback/add',methods=['GET','POST'])
def add_feedback_page(username):
    if session.get('username') == username:
        form = FeedbackForm()
        if form.validate_on_submit():
            new_feedback = Feedback.addFeedback(title=form.title.data,content=form.content.data,username=username)
            flash('New Feedback added!','success')
            return redirect(f'/users/{username}')

        return render_template('add_feedback.html',form=form)
    else:
        return redirect('/register')

@app.route('/users/<username>/delete',methods=['POST'])
def delete_user(username):
    if session.get('username') == username:
        User.delete_user(username)
        session.clear()
        flash(f'The user {username} deleted successfully!','success')
        return redirect('/')

    return redirect('/register')

@app.route('/feedback/<int:feedback_id>/delete',methods=['POST'])
def delete_feedback(feedback_id):
    feedback = Feedback.query.filter_by(id = feedback_id).one()
    username = feedback.username
    if session.get('username') == username:
        Feedback.delete_feedback(feedback_id)
        flash('Feedback deleted successfully!','success')
        return redirect(f'/users/{username}')

    return redirect('/register')

@app.route('/feedback/<int:feedback_id>/update',methods=['GET','POST'])
def update_feedback(feedback_id):
    feedback = Feedback.query.filter_by(id = feedback_id).one()
    username = feedback.username
    if session.get('username') == username:
        form = FeedbackForm(obj=feedback)
        if form.validate_on_submit():
            Feedback.update_feedback(id=feedback_id,title = form.title.data,content=form.content.data)
            flash('Feedback updated successfully!','success')
            return redirect(f'/users/{username}')
        return render_template('update_feedback.html',form=form)

    return redirect('/register')

