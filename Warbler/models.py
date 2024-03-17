"""SQLAlchemy models for Warbler."""

from datetime import datetime

from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()


class Follows(db.Model):
    """Connection of a follower <-> followed_user."""

    __tablename__ = 'follows'

    user_being_followed_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="cascade"),
        primary_key=True,
    )

    user_following_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="cascade"),
        primary_key=True,
    )


class Likes(db.Model):
    """Mapping user likes to warbles."""

    __tablename__ = 'likes' 

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='cascade')
    )

    message_id = db.Column(
        db.Integer,
        db.ForeignKey('messages.id', ondelete='cascade')
    )


class User(db.Model):
    """User in the system."""

    __tablename__ = 'users'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    email = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )

    username = db.Column(
        db.Text,
        nullable=False,
        unique=True,
    )

    image_url = db.Column(
        db.Text,
        default="/static/images/default-pic.png",
    )

    header_image_url = db.Column(
        db.Text,
        default="/static/images/warbler-hero.jpg"
    )

    bio = db.Column(
        db.Text,
    )

    location = db.Column(
        db.Text,
    )

    password = db.Column(
        db.Text,
        nullable=False,
    )

    messages = db.relationship('Message')

    followers = db.relationship(
        "User",
        secondary="follows",
        primaryjoin=(Follows.user_being_followed_id == id),
        secondaryjoin=(Follows.user_following_id == id)
    )

    following = db.relationship(
        "User",
        secondary="follows",
        primaryjoin=(Follows.user_following_id == id),
        secondaryjoin=(Follows.user_being_followed_id == id)
    )

    likes = db.relationship(
        'Message',
        secondary="likes"
    )

    def __repr__(self):
        return f"<User #{self.id}: {self.username}, {self.email}>"

    def is_followed_by(self, other_user):
        """Is this user followed by `other_user`?"""

        found_user_list = [user for user in self.followers if user == other_user]
        return len(found_user_list) == 1

    def is_following(self, other_user):
        """Is this user following `other_use`?"""

        found_user_list = [user for user in self.following if user == other_user]
        return len(found_user_list) == 1

    def follow_user(self,follow_id):
        followed_user = User.query.get_or_404(follow_id)
        self.following.append(followed_user)
        db.session.commit()

    def unfollow_user(self,follow_id):
        followed_user = User.query.get_or_404(follow_id)
        self.following.remove(followed_user)
        db.session.commit()

    def add_new_message(self, text):
        msg = Message(text=text)
        self.messages.append(msg)
        db.session.commit()

    def like_message(self,message_id):
        msg = Message.query.get(message_id)
        self.likes.append(msg)
        db.session.commit()

    def un_like_message(self,message_id):
        msg = Message.query.get(message_id)
        self.likes.remove(msg)
        db.session.commit()

    def edit_user(self,form):
        username=self.username
        password=form.password.data

        is_auth = User.authenticate(username=username, password=password)

        if is_auth:
            self.username=form.username.data
            self.email=form.email.data
            self.image_url=form.image_url.data or User.image_url.default.arg
            self.header_image_url = form.header_image_url.data or User.header_image_url.default.arg
            self.bio = form.bio.data or None

            db.session.add(self)
            db.session.commit()

            return True
        else:
            return False

    @classmethod
    def signup(cls, form):
        """Sign up user.

        Hashes password and adds user to system.
        """

        username=form.username.data
        password=form.password.data
        email=form.email.data
        image_url=form.image_url.data or User.image_url.default.arg


        pw_hash = bcrypt.generate_password_hash(password)
        hashed_pwd = pw_hash.decode('utf8')

        # hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(
            username=username,
            email=email,
            password=hashed_pwd,
            image_url=image_url,
        )

        db.session.add(user)
        db.session.commit()
        return user

    @classmethod
    def authenticate(cls, username, password):
        """Find user with `username` and `password`.

        This is a class method (call it on the class, not an individual user.)
        It searches for a user whose password hash matches this password
        and, if it finds such a user, returns that user object.

        If can't find matching user (or if password is wrong), returns False.
        """

        user = cls.query.filter_by(username=username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False


class Message(db.Model):
    """An individual message ("warble")."""

    __tablename__ = 'messages'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    text = db.Column(
        db.String(140),
        nullable=False,
    )

    timestamp = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow(),
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
    )

    user = db.relationship('User')

    @classmethod
    def delete_message(cls,id):
        cls.query.filter_by(id=id).delete()
        db.session.commit()


def connect_db(app):
    """Connect this database to provided Flask app.

    You should call this in your Flask app.
    """

    db.app = app
    db.init_app(app)
