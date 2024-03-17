"""User View tests."""

# run these tests like:
#
#    FLASK_ENV=production python -m unittest test_user_views.py


import os
from unittest import TestCase

from models import db, connect_db, Message, User

# BEFORE we import our app, let's set an environmental variable
# to use a different database for tests (we need to do this
# before we import our app, since that will have already
# connected to the database

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"


# Now we can import app

from app import app, CURR_USER_KEY
from forms import UserAddForm
from sqlalchemy import exc

# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data

with app.app_context():
    db.create_all()

# Don't have WTForms use CSRF at all, since it's a pain to test

app.config['WTF_CSRF_ENABLED'] = False

def fillUserAddForm(username,email,password,image_url=None):
    form = UserAddForm()
    form.username.data = username
    form.email.data = email
    form.password.data = password
    form.image_url.data = image_url
    return form 


class UserViewTestCase(TestCase):
    """Test views for messages."""

    def setUp(self):
        """Create test client, add sample data."""
        self.client = app.test_client()

        with app.app_context():
            User.query.delete()
            Message.query.delete()
            db.session.commit()
        
            form = fillUserAddForm(username="testuser", email="test@test.com",password="testuser")
            self.testuser = User.signup(form)
            db.session.commit()
            self.testuser_id = self.testuser.id


    def setup_users(self):
        form = fillUserAddForm(username='Samantha_user1',email='user1@mail.com',password='password123')
        u1 = User.signup(form)

        form = fillUserAddForm(username='Samuel_user2',email='user2@mail.com',password='password234')
        u2 = User.signup(form)

        form = fillUserAddForm(username='Edwards',email='edwards345@test.com',password='password345')
        u3 = User.signup(form)

        return [u1,u2,u3]

    def setup_users_with_messages(self):
        [u1,u2,u3] = self.setup_users()

        u1.add_new_message("This is text for message 1")
        u2.add_new_message("This is text for message 2")
        u2.add_new_message("This is text for message 3")
        u3.add_new_message("This is text for message 4")

        return [u1,u2,u3]

    def test_list_users(self):
        """Tests if the list_users path will show all users without a query"""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            with self.client as c:
                resp = c.get('/users')

                for u in User.query.all():
                    self.assertIn(u.username, str(resp.data))

    def test_list_users_with_search_query(self):
        """Tests if the list_users path will show all users that match the search query"""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            with self.client as c:
                resp = c.get('/users?q=Sam')

                self.assertIn(u1.username, str(resp.data))
                self.assertIn(u2.username, str(resp.data))
                self.assertNotIn(u3.username, str(resp.data))

    def test_users_show(self):
        """Tests if the users_show path will show the requested user page"""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            with self.client as c:
                resp = c.get(f'/users/{u1.id}')

                self.assertEqual(resp.status_code, 200)
                self.assertIn(u1.username, str(resp.data))

    def test_users_show_invalid_id(self):
        """Tests if the users_show path will yield a 404 error if the id is invalid"""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            with self.client as c:
                resp = c.get('/users/8888')
                self.assertEqual(resp.status_code, 404)

    def test_show_following(self):
        """Tests if the show_following path will show all users the current user is following."""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()
            u1.follow_user(u2.id)

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.get(f'/users/{u1.id}/following')

                self.assertIn(u2.username, str(resp.data))
                self.assertNotIn(u3.username, str(resp.data))

    def test_users_followers(self):
        """Tests if the users_followers path will show all followers of the user."""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()
            u1.follow_user(u2.id)

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.get(f'/users/{u2.id}/followers')

                self.assertIn(u1.username, str(resp.data))
                self.assertNotIn(u3.username, str(resp.data))

    def test_add_follow(self):
        """Tests if the add_follow path will successfully add a followed user."""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            self.assertEqual(len(u1.following),0)

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.post(f'/users/follow/{u2.id}')

            self.assertEqual(len(u1.following),1)
            self.assertEqual(u1.following[0],u2)

    def test_add_follow_invalid_user_id(self):
        """Tests if the add_follow path will not add an invalid followed user"""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            self.assertEqual(len(u1.following),0)

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.post('/users/follow/9999')

            self.assertEqual(resp.status_code, 404)
            self.assertEqual(len(u1.following),0)

    def test_stop_following(self):
        """Tests if the stop_following path will successfully remove a followed user."""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()
            u1.follow_user(u2.id)
            u1.follow_user(u3.id)

            self.assertEqual(len(u1.following),2)
            self.assertIn(u2,u1.following)
            self.assertIn(u3,u1.following)

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.post(f'/users/stop-following/{u2.id}')

            self.assertEqual(len(u1.following),1)
            self.assertIn(u3,u1.following)
            self.assertNotIn(u2,u1.following)

    def test_stop_following_invalid_user_id(self):
        """Tests if the stop_following path will not cause problems with an invalid followed user."""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()
            u1.follow_user(u2.id)

            self.assertEqual(len(u1.following),1)

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.post('/users/stop-following/9999')

            self.assertEqual(resp.status_code, 404)
            self.assertEqual(len(u1.following),1)

    def test_profile_edit_user(self):
        """Tests the profile path which when given a post request will edit a user's information"""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            self.assertEqual(u1.username,'Samantha_user1')
            self.assertEqual(u1.email, 'user1@mail.com')
            self.assertIsNone(u1.bio)

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.post('/users/profile', data={"username": "Samantha1", 
                                                                      "email":'samantha1@test.com',
                                                                      "bio": "This is some text for Samantha\'s bio",
                                                                      "password": "password123"})

            self.assertEqual(u1.username,'Samantha1')
            self.assertEqual(u1.email, 'samantha1@test.com')
            self.assertIsNotNone(u1.bio)

    def test_profile_edit_user_invalid_password(self):
        """Tests the profile path (POST) which should prevent editing the user information with an invalid password"""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            self.assertEqual(u1.username,'Samantha_user1')
            self.assertEqual(u1.email, 'user1@mail.com')
            self.assertIsNone(u1.bio)

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.post('/users/profile', data={"username": "Samantha1", 
                                                                      "email":'samantha1@test.com',
                                                                      "bio": "This is some text for Samantha\'s bio",
                                                                      "password": "invalid_password999"},
                                                follow_redirects=True)

            self.assertIn('Access unauthorized.',str(resp.data))
            self.assertEqual(u1.username,'Samantha_user1')
            self.assertEqual(u1.email, 'user1@mail.com')
            self.assertIsNone(u1.bio)

    def test_profile_edit_user_username_already_exists(self):
        """Tests the profile path (POST) which should prevent editing the user information if new username already exists."""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            self.assertEqual(u1.username,'Samantha_user1')
            self.assertEqual(u1.email, 'user1@mail.com')
            self.assertIsNone(u1.bio)

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.post('/users/profile', data={"username": "Edwards", 
                                                                    "email":'samanthaEdwards@test.com',
                                                                    "bio": "This is some text for Samantha\'s bio",
                                                                    "password": "password123"},
                                                follow_redirects=True)

                self.assertIn("Username already taken",str(resp.data))
                self.assertEqual(u1.username,'Samantha_user1')
                self.assertEqual(u1.email, 'user1@mail.com')
                self.assertIsNone(u1.bio)

    def test_delete_user(self):
        """Tests the delete_user path which should delete the current user."""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                self.assertEqual(len(User.query.all()),4)
                self.assertIn(u1,User.query.all())

                resp = c.post('/users/delete',follow_redirects=True)

            self.assertEqual(len(User.query.all()),3)
            self.assertNotIn(u1,User.query.all())

    def test_view_likes(self):
        """Tests the view_likes path which shows all the messages the user liked"""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()
            u1.like_message(u2.messages[0].id)

            self.assertEqual(len(u1.likes),1)
            self.assertEqual(u1.likes[0],u2.messages[0])

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.get(f'/users/{u1.id}/likes')

                self.assertIn(u2.messages[0].text, str(resp.data))
                self.assertNotIn(u2.messages[1].text, str(resp.data))
                self.assertNotIn(u3.messages[0].text, str(resp.data))

    def test_view_likes_invalid_user_id(self):
        """Tests if the view_likes path will not cause problems with an invalid user_id."""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()
            u1.like_message(u2.messages[0].id)

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.get('/users/9999/likes')

            self.assertEqual(resp.status_code, 404)

    def test_like_message(self):
        """Test if the like_message path will successfuly add a like for the user"""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            self.assertEqual(len(u1.likes),0)

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.post(f'/users/add_like/{u2.messages[0].id}')

            self.assertEqual(len(u1.likes),1)
            self.assertEqual(u1.likes[0],u2.messages[0])

    def test_un_like_message(self):
        """Test if the un_like_message path will successfuly remove a like for the user"""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()
            u1.like_message(u2.messages[0].id)

            self.assertEqual(len(u1.likes),1)
            self.assertIn(u2.messages[0],u1.likes)

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.post(f'/users/remove_like/{u2.messages[0].id}')

            self.assertEqual(len(u1.likes),0)
            self.assertNotIn(u2.messages[0],u1.likes)

