"""Models for Blogly."""
from flask_sqlalchemy import SQLAlchemy 
from datetime import datetime

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

    posts = db.relationship('Post', back_populates="user", cascade="all, delete-orphan", passive_deletes=True)



class Post (db.Model):
    __tablename__ = 'posts'

    def __repr__(self):
        'Shows information about a user in a readable format'
        u = self
        return f'<Post id: {u.id}, title: {u.title}, content: {u.content}, created_at: {u.created_at}, user_id [FK]: {u.user_id}>'

    @classmethod
    def get_post_by_id(cls,id):
        return cls.query.filter_by(id=id).one()

    @classmethod
    def delete_post_by_id(cls,id):
        'Deletes a post from the database given an id'
        cls.query.filter_by(id = id).delete()
        db.session.commit()

    @classmethod
    def change_post(cls,form,id):
        title = form['title']
        content = form['content']

        post = cls.get_post_by_id(id)
        post.title = title
        post.content = content

        db.session.add(post)
        db.session.commit()



    @classmethod
    def add_new_post(cls,form,id):
        title = form['title']
        content = form['content']
        new_post = cls(title=title,content=content,user_id=id)
        db.session.add(new_post)
        db.session.commit()



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
        db.String(),
        nullable = False
    )
    created_at = db.Column(
        db.DateTime, 
        default = datetime.utcnow,
        nullable = False
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="CASCADE")
    )

    # user = db.relationship('User',backref='posts')
    # user = db.relationship('User', cascade="save-update", back_populates="posts", passive_deletes=True)

    user = db.relationship('User', back_populates="posts", passive_deletes=True)

    @property
    def datetime_created(self):
        mth_abbreviations = ['Jan','Feb','Mar','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec']
        datetime = str(self.created_at).split()
        date = datetime[0].split('-')
        mth = mth_abbreviations[int(date[1])-1]
        time = datetime[1].split(':')
        am_or_pm = 'AM' if int(time[0]) < 12 else 'PM'
        hour = int(time[0]) if int(time[0]) < 13 else int(time[0]) - 12
        return f'{mth} {date[2]}, {date[0]}, {hour}:{time[1]} {am_or_pm}'
    
