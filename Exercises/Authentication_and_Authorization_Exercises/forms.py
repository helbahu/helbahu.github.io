from flask_wtf import FlaskForm
from models import db,User
from wtforms import StringField, IntegerField, SelectField,TextAreaField, FileField, EmailField, PasswordField
from wtforms.validators import InputRequired, Optional, URL, NumberRange, ValidationError, Length, EqualTo, NoneOf



# SIGNUP FORM ---------------------------------------------------------------------------- SIGNUP FORM

def unique_username(form,field):
    all_usernames = [u.username for u in User.query.all()]
    if field.data in all_usernames:
        uniqueUsername = 'Username already exists.'
        raise ValidationError(uniqueUsername)

def unique_email(form,field):
    all_emails = [u.email for u in User.query.all()]
    if field.data in all_emails:
        uniqueEmail = 'Email address already in use.'
        raise ValidationError(uniqueEmail)


class SignUp (FlaskForm):
    # Messages
    uniqueUsername = 'Username already exists.'
    passwordsMatch = 'Passwords must match'
    nameInputLength = 'Name must be between 1 and 30 characters long'
    emailInputLength = 'Email address must be between 1 and 50 characters long'
    usernameInputLength = 'Username must be between 1 and 20 characters long'


    first_name = StringField("First Name",validators=[InputRequired(), Length(min=1,max=30, message=nameInputLength)])
    last_name = StringField("Last Name",validators=[InputRequired(), Length(min=1,max=30, message=nameInputLength)])
    email = EmailField("Email",validators=[InputRequired(), Length(min=1,max=50,message=emailInputLength),unique_email])
    username = StringField("Username",validators=[InputRequired(), Length(min=1,max=20,message=usernameInputLength),unique_username])
    password = PasswordField("Password",validators=[InputRequired(),EqualTo('confirm_password',message=passwordsMatch)])
    confirm_password = PasswordField("Re-enter Password",validators=[InputRequired()])


# LOGIN FORM ---------------------------------------------------------------------------- LOGIN FORM
class Authenticate_Login:
    user = ''

    def __call__(self, form, field):
        if field.name == 'username':
            all_usernames = [u.username for u in User.query.all()]
            if field.data not in all_usernames:
                usernameMsg = 'Invalid Username.'
                raise ValidationError(usernameMsg)
            else:
                Authenticate_Login.user = field.data

        elif field.name == 'password':
            username = Authenticate_Login.user
            result = User.authenticate_user(username=username,password=field.data)

            if not result:
                pwMsg = 'Invalid Password.'
                raise ValidationError(pwMsg)
            else:
                Authenticate_Login.user = ''



class LogIn (FlaskForm):
    username = StringField("Username",validators=[InputRequired(), Authenticate_Login()])
    password = PasswordField("Password",validators=[InputRequired(), Authenticate_Login()])


# ADD/UPDATE FEEDBACK FORM ---------------------------------------------------------------------------- ADD/UPDATE FEEDBACK FORM

class FeedbackForm(FlaskForm):
    titleInputLength = 'The Title must be between 1 and 100 characters long'
    title = StringField("Title",validators=[InputRequired(), Length(min=1,max=100, message=titleInputLength)])
    content = TextAreaField("Content",validators=[InputRequired()])

