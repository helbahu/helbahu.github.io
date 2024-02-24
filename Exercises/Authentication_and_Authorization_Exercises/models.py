from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_bcrypt import Bcrypt

db = SQLAlchemy()

bcrypt = Bcrypt()

def connect_db(app):
    'Connect to database'
    db.app = app

    db.init_app(app)

class User (db.Model):

    __tablename__ = 'users'

    def __repr__(self):
        'Shows information about a user in a readable format'
        u = self
        return f'<id: {u.id}, username: {u.username}, name: {u.fullname}>'

    id = db.Column(
        db.Integer,
        primary_key = True,
        autoincrement = True
    )
    first_name = db.Column(
        db.String(30),
        nullable = False
    )
    last_name = db.Column(
        db.String(30),
        nullable = False
    )

    username = db.Column(
        db.String(20),
        unique = True,
        nullable = False
    )
    password = db.Column(
        db.Text,
        nullable = False
    )
    email = db.Column(
        db.String(50),
        unique = True,
        nullable = False
    )

    @property
    def fullname(self):
        return f'{self.first_name} {self.last_name}'

    @classmethod
    def newUser(cls,first_name,last_name,username,password,email):
        pw_hash = bcrypt.generate_password_hash(password)
        pw_hash_utf8 = pw_hash.decode('utf8')
        new_user = cls(first_name=first_name,last_name=last_name,username=username,password=pw_hash_utf8,email=email)

        db.session.add(new_user)
        db.session.commit()
        return new_user

    @classmethod
    def authenticate_user(cls,username,password):
        user = cls.query.filter_by(username = username).one()
        pw_hash = user.password
        result = bcrypt.check_password_hash(pw_hash,password)
        return result

    @classmethod
    def delete_user(cls,username):
        cls.query.filter_by(username=username).delete()
        db.session.commit()


class Feedback (db.Model):

    __tablename__ = 'feedback'

    def __repr__(self):
        'Shows information about feedback in a readable format'
        f = self
        return f'<id: {f.id}, >'

    id = db.Column(
        db.Integer,
        primary_key = True,
        autoincrement = True
    )
    title = db.Column(
        db.String(100),
        nullable = False
    )
    content = db.Column(
        db.Text,
        nullable = False
    )

    username = db.Column(
        db.Text,
        db.ForeignKey('users.username', ondelete="CASCADE"),        
        nullable = False        
    )

    @classmethod
    def addFeedback(cls,title,content,username):
        new_feedback = cls(title=title,content=content,username=username)
        db.session.add(new_feedback)
        db.session.commit()
        return new_feedback

    @classmethod
    def delete_feedback(cls,id):
        cls.query.filter_by(id=id).delete()
        db.session.commit()

    @classmethod
    def update_feedback(cls,id,title,content):
        feedback = cls.query.filter_by(id=id).one()
        feedback.title = title
        feedback.content = content
        db.session.add(feedback)
        db.session.commit()


    # Relationships
    user = db.relationship('User',backref=db.backref('feedback',cascade="all, delete-orphan"), passive_deletes=True)

