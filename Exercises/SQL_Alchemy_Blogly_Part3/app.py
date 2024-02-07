"""Blogly application."""

from flask import Flask, request, redirect, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User, Post, Tag, PostTag

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


# PART 1 ---------------------------------------------------------------------------------------------------------------------------------------- USERS
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
    flash('New User added successfully','success')
    return redirect('/users')

@app.route('/users/<int:id>')
def user_page(id):
    "Displays the user profile including the user name and profile picture"
    user = User.get_user_by_id(id)


    return render_template('user_profile.html', user = user, posts = user.posts)

@app.route('/users/<int:id>/delete',methods=["POST"])
def delete_user(id):
    "Deletes the selected user from the database"
    delete_user = request.form.get('deleteProfile')
    if delete_user:
        User.delete_user_by_id(id)
        flash('User deleted successfully','success')
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
        flash('User changes saved','success')

    return redirect(f'/users/{id}')


# PART 2 ---------------------------------------------------------------------------------------------------------------------------------------- POSTS


@app.route('/users/<int:id>/posts/new')
def add_new_post(id):
    tags = Tag.get_all_tags_ordered()

    return render_template('add_post.html',id=id,tags=tags)

@app.route('/users/<int:id>/posts/new',methods=['POST'])
def add_new_post_to_db(id):
    Post.add_new_post(request.form,id)
    flash('New post added successfully','success')
    return redirect(f'/users/{id}')



@app.route('/posts/<int:post_id>')
def get_pst_details(post_id):
    post = Post.get_post_by_id(post_id)
    tags = post.tags
    return render_template('view_post.html',post=post, tags = tags)


@app.route('/posts/<int:post_id>/delete',methods=['POST'])
def delete_post(post_id):
    Post.delete_post_by_id(post_id)
    user_id = request.form.get("deletePost")
    flash('Post deleted successfully','success')
    return redirect(f'/users/{user_id}')


@app.route('/posts/<int:post_id>/edit')
def edit_post(post_id):
    post = Post.get_post_by_id(post_id)
    tags = Tag.get_all_tags_ordered()
    post_tags = post.tags
    return render_template('edit_post.html',post=post,tags=tags,post_tags=post_tags)

@app.route('/posts/<int:post_id>/edit',methods=['POST'])
def save_changes_to_post(post_id):
    cancelEdit = request.form.get("cancelEdit")
    if not cancelEdit:
        Post.change_post(request.form,post_id)
        flash('Post changes saved','success')
        return redirect(f'/posts/{post_id}')
    else:
        return redirect(f'/users/{cancelEdit}')


# PART 3 ----------------------------------------------------------------------------------------------------------------------------------------TAGS

@app.route('/tags')
def get_tags_list():
    "Displays all tags in the database"
    tags = Tag.get_all_tags_ordered()

    return render_template('tags_list.html', tags = tags)

@app.route('/tags/<int:tag_id>')
def get_tag_details(tag_id):
    tag = Tag.get_tag_by_id(tag_id)
    posts = tag.posts
    return render_template('tag.html', tag = tag, posts = posts)

@app.route('/tags/new')
def add_new_tag():
    posts = Post.query.all()
    return render_template('add_tag.html',posts = posts)

@app.route('/tags/new', methods=['POST'])
def add_new_tag_to_database():

    try:
        Tag.add_new_tag(request.form)

        flash('New Tag added successfully','success')
        return redirect('/tags')
    except Exception as exc:
        e = exc.__context__
        t = 'duplicate' in str(e)
        db.session.rollback()
        if t:
            flash(f'The "{request.form["tagName"]}" tag already exists','warning')
            return redirect('/tags/new')
    return redirect('/tags')

@app.route('/tags/<int:tag_id>/edit')
def edit_tag(tag_id):
    tag = Tag.get_tag_by_id(tag_id)
    posts = Post.query.all()
    post_tags = tag.posts
    return render_template('edit_tag.html',id = tag_id, tag=tag,posts=posts,post_tags=post_tags)

@app.route('/tags/<int:tag_id>/edit', methods=['POST'])
def edit_tag_save_to_database(tag_id):
    cancelEdit = request.form.get("cancelEdit")
    if not cancelEdit:
        try:
            Tag.edit_tag_by_id(request.form,tag_id)
            flash('Tag edited successfully','success')
        except Exception as exc:
            e = exc.__context__
            t = 'duplicate' in str(e)
            db.session.rollback()
            if t:
                flash(f'The "{request.form["tagName"]}" tag already exists','warning')
                return redirect(f'/tags/{tag_id}/edit')

    return redirect('/tags')

@app.route('/tags/<int:tag_id>/delete', methods=['POST'])
def delete_tag_from_database(tag_id):
    Tag.delete_tag_by_id(tag_id)
    flash('Tag deleted successfully','success')
    return redirect('/tags')

