from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.utils import secure_filename


db = SQLAlchemy()

def connect_db(app):
    'Connect to database'
    db.app = app

    db.init_app(app)

class Pet (db.Model):

    __tablename__ = 'pets'

    def __repr__(self):
        'Shows information about a pet in a readable format'
        p = self
        return f'<id = {p.id}, Pet name: {p.name}, species: {p.species}>'

    id = db.Column(
        db.Integer,
        primary_key = True,
        autoincrement = True
    )

    name = db.Column(
        db.Text,
        nullable = False
    )

    species = db.Column(
        db.Text,
        nullable = False
    )

    photo_url = db.Column(
        db.Text,
        default = "https://www.pngitem.com/pimgs/m/595-5951473_dog-and-cat-silhouette-hale-pet-doors-of.png"
    )
    age = db.Column(
        db.Integer
    )

    notes = db.Column(
        db.Text
    )

    available = db.Column(
        db.Text,
        nullable = False,
        default = 'Available'
    )


    @classmethod
    def add_new_pet(cls, form):
        fieldnames = ['csrf_token','file']
        vals = {f'{f.name}': f.data for f in form if f.data and f.name not in fieldnames}
        f = form.file.data
        if f:
            filename = secure_filename(f.filename)
            path = f'static/pet_profile_images/{form.name.data}__'+filename
            f.save(path)
            vals['photo_url'] = path

        pet = cls(**vals)

        db.session.add(pet)
        db.session.commit()

    @classmethod
    def get_pet_by_id(cls,id):
        return cls.query.get_or_404(id)

    @classmethod
    def edit_pet_by_id(cls,form,id):
        pet = cls.get_pet_by_id(id)
        photo_url = form.photo_url.data
        f = form.file.data
        notes = form.notes.data
        pet.available = form.available.data
        if photo_url:
            pet.photo_url = photo_url
        elif f:
            filename = secure_filename(f.filename)
            path = f'static/pet_profile_images/{pet.name}__'+filename
            f.save(path)
            pet.photo_url = path 
        else:
            pet.photo_url = "https://www.pngitem.com/pimgs/m/595-5951473_dog-and-cat-silhouette-hale-pet-doors-of.png"

        if notes:
            pet.notes = notes

        db.session.add(pet)
        db.session.commit()
