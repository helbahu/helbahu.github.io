from app import app
from models import db, User
from unittest import TestCase

# Using a test database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly_test_db'
app.config['SQLALCHEMY_ECHO'] = False

with app.app_context():
    db.drop_all()
    db.create_all()


# Adds some users to the database
def add_some_users():
    "Adds some users to the test database"
    firstNames = ['Samuel','John','Kevin','Tom']
    lastNames = ['Jackson','Hopkins','Durant','Hanks']
    new_users = [User(first_name = f, last_name = l) for f,l in zip(firstNames,lastNames)]

    with app.app_context():
        db.session.add_all(new_users)
        db.session.commit()        



class TestApp(TestCase):
    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True
        app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']
        with app.app_context():
            db.drop_all()
            db.create_all()


    def test_base_link(self):
        with self.client:
            response = self.client.get('/')

            self.assertEqual(response.status_code, 302)
            self.assertEqual(response.location,'/users')


    def test_main(self):
        "This test the /users link whcih shows all users in the database"
        with self.client:
            add_some_users()

            response = self.client.get('/users')
            html = response.get_data(as_text = True)

            # This shows that the users page shows the added users and in the last_name order (Samuel Jackson is the last name in the list)
            self.assertIn('<li><a href="/users/1"> Samuel Jackson </a></li>\n        \n    </ul>', html)
            self.assertEqual(response.status_code, 200)



    def test_add_new_user_post(self):
        "Tests the /users/new post request which receives info from the Add New User form and adds it to the database"
        with self.client:
            response = self.client.post('/users/new',data={'firstName': 'Anderson', 'lastName': 'Jones', 'profileImage': ''})

            self.assertEqual(response.status_code, 302)
            self.assertEqual(response.location,'/users')

            user = User.get_user_by_id(1)

            self.assertEqual(user.full_name, 'Anderson Jones')


    def test_user_profile(self):
        "Tests the /users/<int:id> which displays the selected user's profile" 
        with self.client:
            add_some_users()

            response = self.client.get('/users/3')
            html = response.get_data(as_text = True)
            img_url = 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg'
            self.assertIn(f'<div class="profile_image" style="background-image: url({img_url});"></div>\n<h2>Kevin Durant</h2>', html)
            self.assertEqual(response.status_code, 200)


    def test_delete_user(self):
        "Tests the /users/<int:id>/delete link which deletes a user from the database"
        with self.client:
            add_some_users()

            response = self.client.post('/users/2/delete',data={'deleteProfile': 'True'})

            users = [u.full_name for u in User.query.all()]
            self.assertEqual('John Hopkins' in users, False)

            self.assertEqual(response.status_code, 302)
            self.assertEqual(response.location,'/users')


    def test_edit_user(self):
        "Tests the /users/<int:id>/edit link which gets the information from the edit form and updates the database with the new user information"
        with self.client:
            add_some_users()

            response = self.client.post('/users/2/edit',data={'firstName': 'Jonathan', 'lastName': 'Hopkins', 'profileImage': ''})

            users = [u.full_name for u in User.query.all()]
            self.assertEqual(users[3] == 'John Hopkins', False)
            self.assertEqual(users[3] == 'Jonathan Hopkins', True)

            self.assertEqual(response.status_code, 302)
            self.assertEqual(response.location,'/users/2')


