from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, EmailField
from wtforms.validators import DataRequired, Length, URL, Optional


class MessageForm(FlaskForm):
    """Form for adding/editing messages."""

    text = TextAreaField('text', validators=[DataRequired()])


class UserAddForm(FlaskForm):
    """Form for adding users."""

    username = StringField('Username', validators=[DataRequired()])
    email = EmailField('E-mail', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])
    image_url = StringField('(Optional) Image URL', validators=[Optional(),URL()])


class LoginForm(FlaskForm):
    """Login form."""

    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])


class EditProfile(FlaskForm):
    """Edit Profile Form."""
    username = StringField('Username', validators=[DataRequired()])
    email = EmailField('E-mail', validators=[DataRequired()])
    image_url = StringField('(Optional) Image URL', validators=[Optional(),URL()])
    header_image_url = StringField('(Optional) Header Image URL', validators=[Optional(),URL()])
    bio = StringField('(Optional) Bio')    
    password = PasswordField('Password', validators=[DataRequired()])




