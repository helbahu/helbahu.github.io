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


    # ----------------------------------------------CLASS METHODS
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


    # ----------------------------------------------TABLE COLUMNS
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


    # ----------------------------------------------PROPERTIES
    @property
    def full_name(self):
        'The full_name property displays the user\'s full name'
        return f'{self.first_name} {self.last_name}'

    # def get_full_name(self):
    #     return f'{self.first_name} {self.last_name}'

    # ----------------------------------------------RELATIONSHIPS
    # Relationship will get the posts associated wtih the user
    posts = db.relationship('Post', back_populates="user", cascade="all, delete-orphan", passive_deletes=True)



class Post (db.Model):
    __tablename__ = 'posts'

    def __repr__(self):
        'Shows information about a user in a readable format'
        u = self
        return f'<Post id: {u.id}, title: {u.title}, content: {u.content}, created_at: {u.created_at}, user_id [FK]: {u.user_id}>'

    # ----------------------------------------------CLASS METHODS
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

        PostTag.query.filter_by(post_id = id).delete()

        tag_ids = form.getlist('tags[]')
        for tag_id in tag_ids:
            tag = Tag.get_tag_by_id(tag_id)
            post.tags.append(tag)

        db.session.add(post)
        db.session.commit()

    @classmethod
    def add_new_post(cls,form,id):
        title = form['title']
        content = form['content']
        new_post = cls(title=title,content=content,user_id=id)

        tag_ids = form.getlist('tags[]')
        for tag_id in tag_ids:
            tag = Tag.get_tag_by_id(tag_id)
            new_post.tags.append(tag)

        db.session.add(new_post)
        db.session.commit()


    # ----------------------------------------------TABLE COLUMNS
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

    # ----------------------------------------------PROPERTIES
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
    

    # ----------------------------------------------RELATIONSHIPS
    # user = db.relationship('User',backref='posts')
    # user = db.relationship('User', cascade="save-update", back_populates="posts", passive_deletes=True)

    # Relationship will get the user associated wtih the post
    user = db.relationship('User', back_populates="posts", passive_deletes=True)



class Tag (db.Model):
    __tablename__ = 'tags'

    def __repr__(self):
        'Shows information about a tag in a readable format'
        t = self
        return f'<Tag id: {t.id}, Tag Name: {t.tag_name}>'

    # ----------------------------------------------CLASS METHODS
    @classmethod
    def get_all_tags_ordered(cls):
        return cls.query.order_by(cls.tag_name).all()

    @classmethod
    def get_tag_by_id(cls,id):
        return cls.query.get(id)
    
    @classmethod
    def add_new_tag(cls,form):
        tagName = form['tagName']
        new_tag = cls(tag_name = tagName)

        post_ids = form.getlist('posts[]')
        for p_id in post_ids:
            post = Post.get_post_by_id(p_id)
            new_tag.posts.append(post)

        db.session.add(new_tag)
        db.session.commit()

    @classmethod
    def edit_tag_by_id(cls,form,id):
        tag = cls.get_tag_by_id(id)
        tag.tag_name = form['tagName']         

        PostTag.query.filter_by(tag_id = id).delete()

        post_ids = form.getlist('posts[]')
        for p_id in post_ids:
            post = Post.get_post_by_id(p_id)
            tag.posts.append(post)

        db.session.add(tag)
        db.session.commit()

    @classmethod
    def delete_tag_by_id(cls,id):
        cls.query.filter_by(id = id).delete()
        db.session.commit()


    # ----------------------------------------------TABLE COLUMNS
    id = db.Column(
        db.Integer,
        primary_key = True,
        autoincrement = True
    )
    tag_name = db.Column(
        db.String(50),
        nullable = False,
        unique = True
    )

    # ----------------------------------------------PROPERTIES

    # ----------------------------------------------RELATIONSHIPS
    posts = db.relationship(
        'Post', secondary = 'posts_tags', backref = 'tags'
    )



class PostTag (db.Model):
    __tablename__ = 'posts_tags'

    def __repr__(self):
        'Shows information about a post_tag row in a readable format'
        t = self
        return f'<Post id: {t.post_id}, Tag id: {t.tag_id}>'

    # ----------------------------------------------CLASS METHODS


    # ----------------------------------------------TABLE COLUMNS
    post_id = db.Column(
        db.Integer,
        db.ForeignKey('posts.id', ondelete="CASCADE"),        
        primary_key = True,
    )
    tag_id = db.Column(
        db.Integer,
        db.ForeignKey('tags.id', ondelete="CASCADE"),        
        primary_key = True,
    )

    # ----------------------------------------------PROPERTIES

    # ----------------------------------------------RELATIONSHIPS
    tag = db.relationship('Tag',backref=db.backref('assignment',cascade="all, delete-orphan"), passive_deletes=True)

    post = db.relationship('Post',backref=db.backref('assignment',cascade="all, delete-orphan"), passive_deletes=True)


 