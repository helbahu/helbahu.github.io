"""User model tests."""

# run these tests like:
#
#    python -m unittest test_user_model.py


import os
from unittest import TestCase

from models import db, User, Message, Follows

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


class UserModelTestCase(TestCase):
    """Test the user model."""

    def setUp(self):
        """Create test client, add sample data."""
        with app.app_context():
            User.query.delete()
            Message.query.delete()
            Follows.query.delete()
            db.session.commit()

        self.client = app.test_client()

    def test_user_model(self):
        """Does basic model work?"""
        with app.app_context():
            u = User(
                email="test@test.com",
                username="testuser",
                password="HASHED_PASSWORD"
            )

            db.session.add(u)
            db.session.commit()

            # User should have no messages & no followers
            self.assertEqual(len(u.messages), 0)
            self.assertEqual(len(u.followers), 0)

    def test_classmethod_signup(self):
        with app.app_context():
            all_users = User.query.all()
            self.assertEqual(len(all_users),0)

            form = fillUserAddForm(username='user1',email='user1@mail.com',password='password123')
            
            user = User.signup(form)

            all_users = User.query.all()
            self.assertEqual(len(all_users),1)
            self.assertEqual(all_users[0], user)

    def test_classmethod_authenticate(self):
        with app.app_context():        
            form = fillUserAddForm(username='user1',email='user1@mail.com',password='password123')
            User.signup(form)

            auth_correct = User.authenticate('user1','password123')
            self.assertTrue(auth_correct)

            auth_pw_incorrect = User.authenticate('user1','password1234')
            self.assertFalse(auth_pw_incorrect)

            auth_username_nonexistent = User.authenticate('user111111','password123')
            self.assertFalse(auth_username_nonexistent)

    def test_method_edit_user(self):
        with app.app_context():        
            form = fillUserAddForm(username='user1',email='user1@mail.com',password='password123')
            user = User.signup(form)

            all_users = User.query.all()
            self.assertEqual(all_users[0], user)
            self.assertEqual(all_users[0].username, 'user1')
            self.assertEqual(all_users[0].email, 'user1@mail.com')
            self.assertIsNone(all_users[0].bio)

            edit_form = fillEditProfileForm(username='user1',email='user1@mail.com',password='password123',bio='Some text for the bio')
            result_success = user.edit_user(edit_form)
            self.assertTrue(result_success)

            all_users = User.query.all()
            self.assertIsNotNone(all_users[0].bio)

            edit_form_incorrect_password = fillEditProfileForm(username='user1',email='user1@mail.com',password='password1',bio='Some text for the bio')
            result_incorrect_password = user.edit_user(edit_form_incorrect_password)
            self.assertFalse(result_incorrect_password)


    def setup_users(self):
        form = fillUserAddForm(username='user1',email='user1@mail.com',password='password123')
        u1 = User.signup(form)

        form = fillUserAddForm(username='user2',email='user2@mail.com',password='password234')
        u2 = User.signup(form)

        form = fillUserAddForm(username='user3',email='user3@mail.com',password='password345')
        u3 = User.signup(form)

        return [u1,u2,u3]


    def test_follow_user(self):
        with app.app_context():        
            [u1,u2,u3] = self.setup_users()

            self.assertEqual(len(u1.followers),0)
            self.assertEqual(len(u1.following),0)

            u1.follow_user(u2.id)
            u1.follow_user(u3.id)
            u2.follow_user(u1.id)

            self.assertEqual(len(u1.followers),1)
            self.assertEqual(len(u1.following),2)

    def test_unfollow_user(self):
        with app.app_context():        
            [u1,u2,u3] = self.setup_users()

            self.assertEqual(len(u1.followers),0)
            self.assertEqual(len(u1.following),0)

            u1.follow_user(u2.id)
            u1.follow_user(u3.id)
            u2.follow_user(u1.id)

            self.assertEqual(len(u1.followers),1)
            self.assertEqual(len(u1.following),2)

            u2.unfollow_user(u1.id)

            self.assertEqual(len(u1.followers),0)
            self.assertEqual(len(u1.following),2)

            u1.unfollow_user(u2.id)

            self.assertEqual(len(u1.followers),0)
            self.assertEqual(len(u1.following),1)

    def test_is_following(self):
        with app.app_context():        
            [u1,u2,u3] = self.setup_users()

            u1.follow_user(u2.id)
            u1.follow_user(u3.id)
            u2.follow_user(u1.id)

            self.assertTrue(u1.is_following(u2))
            self.assertFalse(u2.is_following(u3))

    def test_is_followed_by(self):
        with app.app_context():        
            [u1,u2,u3] = self.setup_users()

            u1.follow_user(u2.id)
            u1.follow_user(u3.id)
            u2.follow_user(u1.id)

            self.assertTrue(u1.is_followed_by(u2))
            self.assertFalse(u1.is_followed_by(u3))

    def test_add_new_message(self):
        with app.app_context():        
            form = fillUserAddForm(username='user1',email='user1@mail.com',password='password123')
            u1 = User.signup(form)

            self.assertEqual(len(u1.messages),0)

            txt = 'Some text'
            u1.add_new_message(txt)

            self.assertEqual(len(u1.messages),1)
            self.assertEqual(u1.messages[0].text,txt)

    def setup_users_with_messages(self):
        [u1,u2,u3] = self.setup_users()

        u1.add_new_message("This is text for message 1")
        u2.add_new_message("This is text for message 2")
        u2.add_new_message("This is text for message 3")
        u3.add_new_message("This is text for message 4")

        return [u1,u2,u3]

    def test_like_message(self):
        with app.app_context():        
            [u1,u2,u3] = self.setup_users_with_messages()

            self.assertEqual(len(u1.likes),0)

            u1.like_message(u2.messages[0].id)
            u1.like_message(u2.messages[1].id)

            self.assertEqual(len(u1.likes),2)
            self.assertEqual(u1.likes[0],u2.messages[0])
            self.assertEqual(u1.likes[1],u2.messages[1])

    def test_un_like_message(self):
        with app.app_context():        
            [u1,u2,u3] = self.setup_users_with_messages()

            u1.like_message(u2.messages[0].id)
            u1.like_message(u2.messages[1].id)

            self.assertEqual(len(u1.likes),2)

            u1.un_like_message(u2.messages[0].id)
            self.assertEqual(len(u1.likes),1)
            self.assertEqual(u1.likes[0],u2.messages[1])




