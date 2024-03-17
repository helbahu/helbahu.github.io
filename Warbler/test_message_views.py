"""Message View tests."""

# run these tests like:
#
#    FLASK_ENV=production python -m unittest test_message_views.py


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


class MessageViewTestCase(TestCase):
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

    def test_add_message(self):
        """Can use add a message?"""

        # Since we need to change the session to mimic logging in,
        # we need to use the changing-session trick:
        with app.app_context():
            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = self.testuser_id

                # Now, that session setting is saved, so we can have
                # the rest of ours test

                resp = c.post("/messages/new", data={"text": "Hello"})

                # Make sure it redirects
                self.assertEqual(resp.status_code, 302)

                msg = Message.query.one()
                self.assertEqual(msg.text, "Hello")

    def setup_users(self):
        form = fillUserAddForm(username='user1',email='user1@mail.com',password='password123')
        u1 = User.signup(form)

        form = fillUserAddForm(username='user2',email='user2@mail.com',password='password234')
        u2 = User.signup(form)

        form = fillUserAddForm(username='user3',email='user3@mail.com',password='password345')
        u3 = User.signup(form)

        return [u1,u2,u3]

    def setup_users_with_messages(self):
        [u1,u2,u3] = self.setup_users()

        u1.add_new_message("This is text for message 1")
        u2.add_new_message("This is text for message 2")
        u2.add_new_message("This is text for message 3")
        u3.add_new_message("This is text for message 4")

        return [u1,u2,u3]

    def test_messages_show(self):
        """Tests if the messages_show path will show the requested message"""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            with self.client as c:
                resp = c.get(f'/messages/{u1.messages[0].id}')

                self.assertEqual(resp.status_code, 200)
                self.assertIn(u1.messages[0].text, str(resp.data))

    def test_messages_show_invalid(self):
        """Tests if a request for an invalid message id yields a 404 error"""
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            with self.client as c:
                resp = c.get(f'/messages/8888')
                self.assertEqual(resp.status_code, 404)

    def test_messages_destroy(self):
        """Tests if the messages_destroy path can successfully delete a message."""

        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                m = u1.messages[0]
                self.assertIn(m,Message.query.all())

                resp = c.post(f"/messages/{m.id}/delete")

                # Make sure it redirects
                self.assertEqual(resp.status_code, 302)

                self.assertNotIn(m,Message.query.all())

    def test_messages_destroy_invalid_user(self):
        """ Tests if the route prevents another user from deleting another user's message.
            Note: if you are on the site, there is no way to even attempt to delete another
            user's message.
        """

        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                m = u2.messages[0]
                self.assertIn(m,Message.query.all())

                resp = c.post(f"/messages/{m.id}/delete", follow_redirects=True)

                self.assertIn(m,Message.query.all())
                self.assertIn('Access unauthorized.',str(resp.data))

    def test_messages_destroy_invalid_message(self):
        """ Tests if the route prevents another user from deleting another user's message.
            Note: if you are on the site, there is no way to even attempt to delete another
            user's message.
        """

        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.post(f"/messages/8888/delete")

                self.assertEqual(resp.status_code, 404)

    def test_homepage_shows_followed_user_messages(self):
        """ Tests if the homepage will show the messages of the active user and the messages
            of those the user is following.
        """
        with app.app_context():
            [u1,u2,u3] = self.setup_users_with_messages()
            u1.follow_user(u2.id)

            with self.client as c:
                with c.session_transaction() as sess:
                    sess[CURR_USER_KEY] = u1.id

                resp = c.get('/')

                self.assertIn(u1.messages[0].text,str(resp.data))
                self.assertIn(u2.messages[0].text,str(resp.data))
                self.assertIn(u2.messages[1].text,str(resp.data))
                self.assertNotIn(u3.messages[0].text,str(resp.data))


