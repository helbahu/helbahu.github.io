"""Message model tests."""

# run these tests like:
#
#    python -m unittest test_message_model.py


import os
from unittest import TestCase

from models import db, User, Message, Follows
from sqlalchemy import exc

# BEFORE we import our app, let's set an environmental variable
# to use a different database for tests (we need to do this
# before we import our app, since that will have already
# connected to the database

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"


# Now we can import app

from app import app
from forms import UserAddForm, EditProfile, MessageForm
# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data
app.config['WTF_CSRF_ENABLED'] = False


with app.app_context():
    db.create_all()


def fillUserAddForm(username,email,password,image_url=None):
    form = UserAddForm()
    form.username.data = username
    form.email.data = email
    form.password.data = password
    form.image_url.data = image_url
    return form 

def fillEditProfileForm(username,email,password,bio=None,image_url=None,header_image_url=None):
    form = EditProfile()
    form.username.data = username
    form.password.data = password

    form.email.data = email
    form.image_url.data = image_url
    form.header_image_url.data = header_image_url
    form.bio.data = bio

    return form 


class MessageModelTestCase(TestCase):
    """Test the Message model."""

    def setUp(self):
        """Create test client, add sample data."""
        with app.app_context():
            User.query.delete()
            Message.query.delete()
            Follows.query.delete()
            db.session.commit()

        self.client = app.test_client()

    def setup_users(self):
        form = fillUserAddForm(username='user1',email='user1@mail.com',password='password123')
        u1 = User.signup(form)

        form = fillUserAddForm(username='user2',email='user2@mail.com',password='password234')
        u2 = User.signup(form)

        form = fillUserAddForm(username='user3',email='user3@mail.com',password='password345')
        u3 = User.signup(form)

        return [u1,u2,u3]

    def test_message_model(self):
        """Does basic model work?"""
        with app.app_context():
            [u1,u2,u3] = self.setup_users()

            self.assertEqual(len(u1.messages), 0)

            m = Message(text='Test for message 1',user_id=u1.id)
            db.session.add(m)
            db.session.commit()

            # User should have no messages & no followers
            self.assertEqual(len(u1.messages), 1)
            all_messages = Message.query.all()
            self.assertEqual(len(all_messages), 1)
            self.assertEqual(all_messages[0].user_id, u1.id)

            self.assertEqual(all_messages[0].user, u1)

    def test_delete_message(self):
        with app.app_context():
            [u1,u2,u3] = self.setup_users()

            m = Message(text='Test for message 1',user_id=u1.id)
            db.session.add(m)
            db.session.commit()

            all_messages = Message.query.all()
            self.assertEqual(len(all_messages), 1)

            Message.delete_message(m.id)

            all_messages = Message.query.all()
            self.assertEqual(len(all_messages), 0)

    def test_message_model_invalid_user_id(self):
        with app.app_context():
            [u1,u2,u3] = self.setup_users()

            with self.assertRaises(exc.IntegrityError) as context:
                m = Message(text='Test for message 1',user_id=9999)
                db.session.add(m)
                db.session.commit()

