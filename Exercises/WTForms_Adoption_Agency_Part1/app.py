from flask import Flask, request, redirect, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Pet
from werkzeug.utils import secure_filename

from forms import PetForm, EditPetForm

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
def homepage():
    """
        
    """

    pets = Pet.query.all()
    return render_template('base.html',pets=pets)



@app.route('/add',methods=['GET','POST'])
def add_pet():
    """

    """
    form = PetForm()

    if form.validate_on_submit():

        Pet.add_new_pet(form)
        return redirect('/')
    else:
        return render_template('add_pet.html',form=form)


@app.route('/<int:pet_id>',methods=['GET','POST'])
def pet_info_page(pet_id):
    """
    """

    pet = Pet.get_pet_by_id(pet_id)
    form = EditPetForm(obj=pet)
    if form.validate_on_submit():
        Pet.edit_pet_by_id(form,pet_id)
        return redirect('/')
    else:
        return render_template('pet_page.html',pet=pet,form=form)










