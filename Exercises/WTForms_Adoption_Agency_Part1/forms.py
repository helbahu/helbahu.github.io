from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField,TextAreaField, FileField
from wtforms.validators import InputRequired, Optional, URL, NumberRange, ValidationError

class OnlyOneOf:
    count = {}
    def __init__(self,id,name1,message):
        self.id = id
        self.message = message
        self.count[self.id] = None
        self.name1 = name1

    def __call__(self, form, field):
        if field.name == self.name1:
                self.count[self.id] = None
        if field.data:
            if not self.count.get(self.id):
                self.count[self.id] = 1
            else:
                self.count[self.id] = None
                raise ValidationError(self.message)


class PetForm (FlaskForm):
    species_list = ['Cat','Dog','Porcupine']
    message = 'Only one of "Photo URL" and "Upload Image" can be filled.'

    name = StringField("Pet Name",validators=[InputRequired()])

    species = SelectField("Species", validators=[InputRequired()], choices=[(s,s) for s in species_list])
    photo_url = StringField("Photo URL", validators=[URL(),Optional(),OnlyOneOf('pic','photo_url',message)])
    file = FileField("Upload Image", validators=[Optional(),OnlyOneOf('pic','photo_url',message)])
    age = IntegerField("Age (in years)", validators=[Optional(),NumberRange(min=0,max=30)])
    notes = TextAreaField("Notes", validators=[Optional()])

    




class EditPetForm (FlaskForm):
    message = 'Only one of "Photo URL" and "Upload Image" can be filled.'

    photo_url = StringField("Photo URL", validators=[URL(),Optional(),OnlyOneOf('pic2','photo_url',message)])
    file = FileField("Upload Image", validators=[Optional(),OnlyOneOf('pic2','photo_url',message)])
    notes = TextAreaField("Notes", validators=[Optional()])
    available = SelectField("Available For Adoption", validators=[Optional()], choices=[('Available','Available'),('Not Available','Not Available')])

