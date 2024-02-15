from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField,TextAreaField, FileField
from wtforms.validators import InputRequired, Optional, URL, NumberRange, ValidationError

class AddCupcakeForm (FlaskForm):

    flavor = StringField("Cupcake Flavor",validators=[InputRequired()])
    size = SelectField("Size", validators=[InputRequired()], choices=[(s,s) for s in ['x-small','small','medium','large']])
    image = StringField("Image URL", validators=[URL(),Optional()])
    rating = IntegerField("Rating",validators=[InputRequired()])

