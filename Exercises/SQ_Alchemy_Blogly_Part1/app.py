"""Blogly application."""

from flask import Flask, request, redirect, render_template
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

app.config['SECRET_KEY'] = 'bloglyappSecretKey123'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

#ensures debugging is activated
app.debug = True

debug = DebugToolbarExtension(app)

connect_db(app)
# db.create_all()



@app.route('/')
def main_page():
    return redirect('/users')

@app.route('/users')
def users_page():
    "Displays all users in the database"
    users = User.get_all_users_ordered()
    return render_template('base.html', users = users)

@app.route('/users/new')
def add_user():
    "Gets the Add New User Form page"
    return render_template('add_user.html')

@app.route('/users/new',methods=["POST"])
def add_new_user():
    "Gets the Add New User form information and adds the user to the database"
    User.add_new_user(request.form)
    return redirect('/users')

@app.route('/users/<int:id>')
def user_page(id):
    "Displays the user profile including the user name and profile picture"
    user = User.get_user_by_id(id)
    return render_template('user_profile.html', user = user)

@app.route('/users/<int:id>/delete',methods=["POST"])
def delete_user(id):
    "Deletes the selected user from the database"
    delete_user = request.form.get('deleteProfile')
    if delete_user:
        User.delete_user_by_id(id)
    return redirect('/users')

@app.route('/users/<int:id>/edit')
def edit_user(id):
    "Gets the Edit User Form page"
    user = User.get_user_by_id(id)
    user_url = user.image_url
    if user_url == 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg':
        user_url = ''
    return render_template('edit_user.html',user = user, userURL=user_url)

@app.route('/users/<int:id>/edit',methods=["POST"])
def save_changes_to_user(id):
    "Gets the Edit User form information and updates the user and saves it to the database"
    cancelEdit = request.form.get("cancelEdit")
    if not cancelEdit:
        User.change_user_info(request.form,id)

    return redirect(f'/users/{id}')

