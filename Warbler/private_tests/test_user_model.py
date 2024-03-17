"""User model tests."""

# run these tests like:
#
#    python -m unittest test_user_model.py


from app import app
import os
from unittest import TestCase
from sqlalchemy import exc

from models import db, User, Message, Follows
from forms import UserAddForm
# BEFORE we import our app, let's set an environmental variable
# to use a different database for tests (we need to do this
# before we import our app, since that will have already
# connected to the database

os.environ['DATABASE_URL'] = "postgresql:///warbler-test"
app.config['WTF_CSRF_ENABLED'] = False


# Now we can import app


# Create our tables (we do this here, so we only create the tables
# once for all tests --- in each test, we'll delete the data
# and create fresh new clean test data

with app.app_context():
    db.create_all()


class UserModelTestCase(TestCase):
    """Test views for messages."""

    def setUp(self):
        """Create test client, add sample data."""
        with app.app_context():
            db.drop_all()
            db.create_all()

            form = UserAddForm()
            form.username.data = "test1"
            form.email.data = "email1@email.com"
            form.password.data = "password"
            form.image_url.data = None

            u1 = User.signup(form)
            uid1 = 1111
            u1.id = uid1

            form2 = UserAddForm()
            form2.username.data = "test2"
            form2.email.data = "email2@email.com"
            form2.password.data = "password"
            form2.image_url.data = None

            u2 = User.signup(form2)
            uid2 = 2222
            u2.id = uid2

            db.session.commit()

            u1 = User.query.get(uid1)
            u2 = User.query.get(uid2)

            self.u1 = u1
            self.uid1 = uid1

            self.u2 = u2
            self.uid2 = uid2

            self.client = app.test_client()

    def tearDown(self):
        with app.app_context():
            res = super().tearDown()
            db.session.rollback()
            return res

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

    ####
    #
    # Following tests
    #
    ####
    def test_user_follows(self):
        with app.app_context():
            u1 = User.query.get(self.uid1)
            u2 = User.query.get(self.uid2)
            u1.following.append(u2)
            db.session.commit()

            self.assertEqual(len(u2.following), 0)
            self.assertEqual(len(u2.followers), 1)
            self.assertEqual(len(u1.followers), 0)
            self.assertEqual(len(u1.following), 1)

            self.assertEqual(u2.followers[0].id, u1.id)
            self.assertEqual(u1.following[0].id, u2.id)

    def test_is_following(self):
        with app.app_context():
            u1 = User.query.get(self.uid1)
            u2 = User.query.get(self.uid2)
            u1.following.append(u2)
            db.session.commit()

            self.assertTrue(u1.is_following(u2))
            self.assertFalse(u2.is_following(u1))

    def test_is_followed_by(self):
        with app.app_context():
            u1 = User.query.get(self.uid1)
            u2 = User.query.get(self.uid2)
            u1.following.append(u2)
            db.session.commit()

            self.assertTrue(u2.is_followed_by(u1))
            self.assertFalse(u1.is_followed_by(u2))

    ####
    #
    # Signup Tests
    #
    ####
    def test_valid_signup(self):
        with app.app_context():
            form = UserAddForm()
            form.username.data = "testtesttest"
            form.email.data = "testtest@test.com"
            form.password.data = "password"
            form.image_url.data = None

            u_test = User.signup(form)
            uid = 99999
            u_test.id = uid
            db.session.commit()

            u_test = User.query.get(uid)
            self.assertIsNotNone(u_test)
            self.assertEqual(u_test.username, "testtesttest")
            self.assertEqual(u_test.email, "testtest@test.com")
            self.assertNotEqual(u_test.password, "password")
            # Bcrypt strings should start with $2b$
            self.assertTrue(u_test.password.startswith("$2b$"))

    def test_invalid_username_signup(self):
        with app.app_context():

            with self.assertRaises(exc.IntegrityError) as context:
                form = UserAddForm()
                form.username.data = None
                form.email.data = "test@test.com"
                form.password.data = "password"
                form.image_url.data = None

                invalid = User.signup(form)
                uid = 123456789
                invalid.id = uid

                db.session.commit()


    def test_invalid_email_signup(self):
        with app.app_context():
            with self.assertRaises(exc.IntegrityError) as context:

                form = UserAddForm()
                form.username.data = "testtest"
                form.email.data = None
                form.password.data = "password"
                form.image_url.data = None

                invalid = User.signup(form)

                uid = 123789
                invalid.id = uid
                db.session.commit()


    def test_invalid_password_signup(self):
        with app.app_context():

            with self.assertRaises(ValueError) as context:
                form = UserAddForm()
                form.username.data = "testtest"
                form.email.data = "email@email.com"
                form.password.data = ""
                form.image_url.data = None                
                User.signup(form)

            with self.assertRaises(ValueError) as context:
                form = UserAddForm()
                form.username.data = "testtest"
                form.email.data = "email@email.com"
                form.password.data = None
                form.image_url.data = None                
                User.signup(form)


    ####
    #
    # Authentication Tests
    #
    ####
    def test_valid_authentication(self):
        with app.app_context():
            u1 = User.query.get(self.uid1)
            u = User.authenticate(u1.username, "password")
            self.assertIsNotNone(u)
            self.assertEqual(u.id, self.uid1)

    def test_invalid_username(self):
        with app.app_context():
            self.assertFalse(User.authenticate("badusername", "password"))

    def test_wrong_password(self):
        with app.app_context():
            u1 = User.query.get(self.uid1)
            self.assertFalse(User.authenticate(u1.username, "badpassword"))
