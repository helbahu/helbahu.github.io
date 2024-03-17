import os

from flask import Flask, render_template, request, flash, redirect, session, g
from flask import jsonify, make_response
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError

from forms import UserAddForm, LoginForm, MessageForm, EditProfile
from models import db, connect_db, User, Message, Follows, Likes
import pdb 

CURR_USER_KEY = "curr_user"

app = Flask(__name__)

# Get DB_URI from environ variable (useful for production/testing) or,
# if not set there, use development local db.
database_url = os.environ.get('DATABASE_URL')
secret_key = os.environ.get('SECRET_KEY')

app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', database_url))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = True
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secret_key)
toolbar = DebugToolbarExtension(app)

connect_db(app)


##############################################################################
# User signup/login/logout

@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])
    else:
        g.user = None


def do_login(user):
    """Log in user."""

    session[CURR_USER_KEY] = user.id


def do_logout():
    """Logout user."""

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]


@app.route('/signup', methods=["GET", "POST"])
def signup():
    """Handle user signup.

    Create new user and add to DB. Redirect to home page.

    If form not valid, present form.

    If the there already is a user with that username: flash message
    and re-present form.
    """

    form = UserAddForm()

    if form.validate_on_submit():
        try:
            user = User.signup(form=form)

        except IntegrityError:
            flash("Username already taken", 'danger')
            return render_template('users/signup.html', form=form)

        do_login(user)

        return redirect("/")

    else:
        return render_template('users/signup.html', form=form)


@app.route('/login', methods=["GET", "POST"])
def login():
    """Handle user login."""

    form = LoginForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data,
                                 form.password.data)

        if user:
            do_login(user)
            flash(f"Hello, {user.username}!", "success")
            return redirect("/")

        flash("Invalid credentials.", 'danger')

    return render_template('users/login.html', form=form)


@app.route('/logout')
def logout():
    """Handle logout of user."""

    do_logout()
    flash(f"Goodbye!", "success")
    return redirect('/login')



##############################################################################
# General user routes:

@app.route('/users')
def list_users():
    """Page with listing of users.

    Can take a 'q' param in querystring to search by that username.
    """

    search = request.args.get('q')

    if not search:
        users = User.query.all()
    else:
        users = User.query.filter(User.username.like(f"%{search}%")).all()

    return render_template('users/index.html', users=users)


@app.route('/users/<int:user_id>')
def users_show(user_id):
    """Show user profile."""

    user = User.query.get_or_404(user_id)

    # snagging messages in order from the database;
    # user.messages won't be in order by default
    messages = (Message
                .query
                .filter(Message.user_id == user_id)
                .order_by(Message.timestamp.desc())
                .limit(100)
                .all())
    return render_template('users/show.html', user=user, messages=messages)


@app.route('/users/<int:user_id>/following')
def show_following(user_id):
    """Show list of people this user is following."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    user = User.query.get_or_404(user_id)
    return render_template('users/following.html', user=user)


@app.route('/users/<int:user_id>/followers')
def users_followers(user_id):
    """Show list of followers of this user."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    user = User.query.get_or_404(user_id)
    return render_template('users/followers.html', user=user)


# @app.route('/users/follow/<int:follow_id>', methods=['POST'])
# def add_follow(follow_id):
#     """Add a follow for the currently-logged-in user."""

#     if not g.user:
#         flash("Access unauthorized.", "danger")
#         return redirect("/")

#     g.user.follow_user(follow_id)

#     return redirect(f"/users/{g.user.id}/following")


# @app.route('/users/stop-following/<int:follow_id>', methods=['POST'])
# def stop_following(follow_id):
#     """Have currently-logged-in-user stop following this user."""

#     if not g.user:
#         flash("Access unauthorized.", "danger")
#         return redirect("/")

#     g.user.unfollow_user(follow_id)

#     return redirect(f"/users/{g.user.id}/following")

@app.route('/users/follow/<int:follow_id>', methods=['POST'])
def add_follow(follow_id):
    """Add a follow for the currently-logged-in user."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    try:
        g.user.follow_user(follow_id)
        res = make_response(jsonify({'message': True}),200)
    except:
        res = make_response(jsonify({'message': False}),200)

    return res


@app.route('/users/stop-following/<int:follow_id>', methods=['POST'])
def stop_following(follow_id):
    """Have currently-logged-in-user stop following this user."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    try:
        g.user.unfollow_user(follow_id)
        res = make_response(jsonify({'message': True}),200)
    except:
        res = make_response(jsonify({'message': False}),200)

    return res


@app.route('/users/profile', methods=["GET", "POST"])
def profile():
    """Update profile for current user."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    usr = g.user
    if usr.image_url == '/static/images/default-pic.png':
        usr.image_url = None
    if usr.header_image_url == '/static/images/warbler-hero.jpg':
        usr.header_image_url = None
    
    form = EditProfile(obj=usr)

    if form.validate_on_submit():
        try:
            result = g.user.edit_user(form=form)
            if result:
                return redirect(f'/users/{g.user.id}')
            else:
                flash("Access unauthorized.", "danger")
                return redirect(f'/')

        except IntegrityError:
            db.session.rollback()
            flash("Username already taken", 'danger')
            return redirect('/users/profile')

    else:
        return render_template('users/edit.html', form=form,user_id=g.user.id)


@app.route('/users/delete', methods=["POST"])
def delete_user():
    """Delete user."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    do_logout()
    User.query.filter_by(id=g.user.id).delete()
    db.session.commit()

    return redirect("/signup")



##############################################################################
# Likes routes:

@app.route('/users/<int:user_id>/likes')
def view_likes(user_id):
    """Show list of likes of this user."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    user = User.query.get_or_404(user_id)
    return render_template('users/likes.html', user=user)


# @app.route('/users/add_like/<int:message_id>', methods=["POST"])
# def like_message(message_id):
#     """Like the message"""
#     if not g.user:
#         flash("Access unauthorized.", "danger")
#         return redirect("/")

#     g.user.like_message(message_id)

#     return render_template('users/likes.html', user=g.user)

# @app.route('/users/remove_like/<int:message_id>', methods=["POST"])
# def un_like_message(message_id):
#     """Un-like the message"""

#     if not g.user:
#         flash("Access unauthorized.", "danger")
#         return redirect("/")

#     g.user.un_like_message(message_id)

#     return render_template('users/likes.html', user=g.user)

@app.route('/users/add_like/<int:message_id>', methods=["POST"])
def like_message(message_id):
    """Like the message"""
    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    try:
        g.user.like_message(message_id)
        res = make_response(jsonify({'message': True}),200)
    except:
        res = make_response(jsonify({'message': False}),200)

    return res


@app.route('/users/remove_like/<int:message_id>', methods=["POST"])
def un_like_message(message_id):
    """Un-like the message"""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    try:
        g.user.un_like_message(message_id)
        res = make_response(jsonify({'message': True}),200)
    except:
        res = make_response(jsonify({'message': False}),200)

    return res



##############################################################################
# Messages routes:

@app.route('/messages/new', methods=["GET", "POST"])
def messages_add():
    """Add a message:

    Show form if GET. If valid, update message and redirect to user page.
    """

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    form = MessageForm()

    if form.validate_on_submit():
        g.user.add_new_message(form.text.data)

        return redirect(f"/users/{g.user.id}")

    return render_template('messages/new.html', form=form)


@app.route('/messages/<int:message_id>', methods=["GET"])
def messages_show(message_id):
    """Show a message."""

    msg = Message.query.get_or_404(message_id)
    return render_template('messages/show.html', message=msg)


@app.route('/messages/<int:message_id>/delete', methods=["POST"])
def messages_destroy(message_id):
    """Delete a message."""

    if not g.user:
        flash("Access unauthorized.", "danger")
        return redirect("/")

    if Message.query.get_or_404(message_id) in g.user.messages:
        Message.delete_message(message_id)
        return redirect(f"/users/{g.user.id}")
    else:
        flash("Access unauthorized.", "danger")
        return redirect("/")


##############################################################################
# Homepage and error pages

@app.route('/')
def homepage():
    """Show homepage:

    - anon users: no messages
    - logged in: 100 most recent messages of followed_users
    """

    if g.user:
        messages = (Message
                    .query
                    .filter(Message.user_id.in_([g.user.id,*[u.id for u in g.user.following]]))
                    .order_by(Message.timestamp.desc())
                    .limit(100)
                    .all())

        likes = g.user.likes

        return render_template('home.html', messages=messages,likes=likes)

    else:
        return render_template('home-anon.html')


##############################################################################
# 404 Page
@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"),404


##############################################################################
# Turn off all caching in Flask
#   (useful for dev; in production, this kind of stuff is typically
#   handled elsewhere)
#
# https://stackoverflow.com/questions/34066804/disabling-caching-in-flask

@app.after_request
def add_header(req):
    """Add non-caching headers on every request."""

    req.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    req.headers["Pragma"] = "no-cache"
    req.headers["Expires"] = "0"
    req.headers['Cache-Control'] = 'public, max-age=0'
    return req