"""Blogly application."""

from flask import Flask, request, redirect, render_template
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User, Post

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

app.config['SECRET_KEY'] = 'bloglyappSecretKey123'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

#ensures debugging is activated
# app.debug = True

debug = DebugToolbarExtension(app)

connect_db(app)


@app.route('/')
def main_page():
    recent_posts = Post.query.order_by(Post.created_at.desc()).limit(5)

    return render_template('homepage.html', posts = recent_posts)


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


    # for p in user.posts:
    #     print('////////////')
    #     print(p)


    return render_template('user_profile.html', user = user, posts = user.posts)

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


# PART 2 ----------------------------------------------------------------------------------------------------------------------------------------PART 2


@app.route('/users/<int:id>/posts/new')
def add_new_post(id):
    return render_template('add_post.html',id=id)

@app.route('/users/<int:id>/posts/new',methods=['POST'])
def add_new_post_to_db(id):
    Post.add_new_post(request.form,id)
    return redirect(f'/users/{id}')



@app.route('/posts/<int:post_id>')
def get_pst_details(post_id):
    post = Post.get_post_by_id(post_id)
    return render_template('view_post.html',post=post)


@app.route('/posts/<int:post_id>/delete',methods=['POST'])
def delete_post(post_id):
    Post.delete_post_by_id(post_id)
    user_id = request.form.get("deletePost")

    return redirect(f'/users/{user_id}')


@app.route('/posts/<int:post_id>/edit')
def edit_post(post_id):
    post = Post.get_post_by_id(post_id)
    return render_template('edit_post.html',post=post)

@app.route('/posts/<int:post_id>/edit',methods=['POST'])
def save_changes_to_post(post_id):
    cancelEdit = request.form.get("cancelEdit")
    if not cancelEdit:
        Post.change_post(request.form,post_id)
        return redirect(f'/posts/{post_id}')
    else:
        return redirect(f'/users/{cancelEdit}')

