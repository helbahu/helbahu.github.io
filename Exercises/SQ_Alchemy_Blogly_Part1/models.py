"""Models for Blogly."""
from flask_sqlalchemy import SQLAlchemy 

db = SQLAlchemy()

def connect_db(app):
    'Connect to database'    
    db.app = app

    db.init_app(app)


class User (db.Model):

    __tablename__ = 'users'

    def __repr__(self):
        'Shows information about a user in a readable format'
        u = self
        return f'<User id: {u.id}, first_name: {u.first_name}, last_name: {u.last_name}, image_url: {u.image_url}>'

    @classmethod
    def get_all_users_ordered(cls):
        'Gets all users from the database in the specified order criteria'
        return cls.query.order_by(cls.last_name,cls.first_name).all()
        # return cls.query.order_by(cls.last_name.desc(),cls.first_name.desc()).all() #FOR DESCENDING ORDER


    @classmethod
    def get_user_by_id(cls,id):
        'Gets a user by the given id from the database'
        return cls.query.filter_by(id = id).all()[0]

    @classmethod
    def add_new_user(cls,form):
        'Adds a new user to the database, requires the form object from a post request that has firstName, lastName and profileImage'
        firstName = form["firstName"]
        lastName = form["lastName"]
        imageUrl = form["profileImage"]

        imageUrl = imageUrl if imageUrl != '' else None
        if imageUrl:
            new_user = cls(first_name = firstName, last_name = lastName, image_url = imageUrl)
        else:
            new_user = cls(first_name = firstName, last_name = lastName)
        db.session.add(new_user)
        db.session.commit()

    @classmethod
    def change_user_info(cls,form,id):
        'Updates a user\'s information and saves it to the database, requires the user id and a form object from a post request that has firstName, lastName and profileImage'

        firstName = form["firstName"]
        lastName = form["lastName"]
        imageUrl = form["profileImage"]

        user = cls.get_user_by_id(id)
        user.first_name = firstName
        user.last_name = lastName
        user.image_url = imageUrl if imageUrl != '' else 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'

        db.session.add(user)
        db.session.commit()


    @classmethod
    def delete_user_by_id(cls,id):
        'Deletes a user from the database given an id'
        cls.query.filter_by(id = id).delete()
        db.session.commit()


    id = db.Column(
        db.Integer,
        primary_key = True,
        autoincrement = True
    )
    first_name = db.Column(
        db.String(50),
        nullable = False
    )
    last_name = db.Column(
        db.String(50),
        nullable = False
    )
    image_url = db.Column(
        db.String(),
        nullable = False,
        default = 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'
    )


    @property
    def full_name(self):
        'The full_name property displays the user\'s full name'
        return f'{self.first_name} {self.last_name}'

    # def get_full_name(self):
    #     return f'{self.first_name} {self.last_name}'

