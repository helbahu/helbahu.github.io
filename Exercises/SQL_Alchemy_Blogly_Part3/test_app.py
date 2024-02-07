from app import app
from models import db, User, Post, Tag, PostTag
from unittest import TestCase
from random import randint, seed

# Using a test database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly_test_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
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

def add_some_posts():
    "Adds some posts to the test database"
    posts = []
    for i in range(20):
        t = f'Title{i}'
        c = 'This is some text for the content'
        if i == 0:
            seed(5)
        u = randint(1,4)
        post = Post(title= t, content= c, user_id= u)
        posts.append(post)

    with app.app_context():
        db.session.add_all(posts)
        db.session.commit()

def add_some_tags():
    tag_names = ['Funny','Exciting','Vacations','Food', 'Technology','Science','Nature','Art','Sports','Health']
    tags = []
    for n in tag_names:
        tag = Tag(tag_name = n)
        tags.append(tag)

    with app.app_context():
        db.session.add_all(tags)
        db.session.commit()

def add_post_tag_remationships():
    all_post_tag_relationships = []
    post_set_test = set([])
    for i in range(20):
        if i == 0:
            seed(5)
        post_id = randint(1,20)
        tag_id = randint(1,10)
        tup = (post_id,tag_id)
        pt = PostTag(post_id = post_id, tag_id = tag_id)
        if not tup in post_set_test:
            all_post_tag_relationships.append(pt)
            post_set_test.add(tup)

    with app.app_context():
        db.session.add_all(all_post_tag_relationships)
        db.session.commit()





class TestApp(TestCase):
    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True
        app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']
        with app.app_context():
            db.drop_all()
            db.create_all()


    def test_homepage(self):
        with self.client:
            add_some_users()
            add_some_posts()

            response = self.client.get('/')
            html = response.get_data(as_text = True)

            self.assertIn('Title19', html)
            self.assertEqual(response.status_code, 200)


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
        "Tests the /users/<int:id> which displays the selected user's profile including user information and user posts" 
        with self.client:
            add_some_users()
            id = 3

            title ='Test Title'
            content = 'This is test content.'
            new_post = Post(title=title,content=content,user_id=id)
            with app.app_context():
                db.session.add(new_post)
                db.session.commit()

            response = self.client.get(f'/users/{id}')
            html = response.get_data(as_text = True)

            self.assertIn('Kevin Durant', html)
            self.assertIn('Test Title', html)
            self.assertEqual(response.status_code, 200)


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


    def test_delete_user(self):
        "Tests the /users/<int:id>/delete link which deletes a user from the database"
        with self.client:
            add_some_users()
            add_some_posts()


            # This will get all the posts of user 2 and all the posts in the database
            with app.app_context():
                user_posts = User.query.filter_by(id=2).one().posts
                all_posts = Post.query.all()

            # This will check that all the user 2 posts are in the database before deleting the user
            for p in user_posts:
                self.assertEqual(p in all_posts, True)


            response = self.client.post('/users/2/delete',data={'deleteProfile': 'True'})

            # This checks if user 2 with the name John Hopkins was deleted from the database
            users = [u.full_name for u in User.query.all()]
            self.assertEqual('John Hopkins' in users, False)

            self.assertEqual(response.status_code, 302)
            self.assertEqual(response.location,'/users')


            # This will get all the posts in the database after deleting user 2
            with app.app_context():
                all_posts = Post.query.all()

            # This will check if all the posts of the deleted user 2 were also deleted as expected.
            for p in user_posts:
                self.assertEqual(p in all_posts, False)


    def test_add_new_post(self):
        "Tests the /users/<int:id>/posts/new post request which receives info from the Add New Post form and adds it to the database"
        with self.client:
            add_some_users()
            
            title = 'Test Title For Mr. Hanks'
            content = 'This is some test text for the content of the post'

            response = self.client.post('/users/4/posts/new',data={'title': title, 'content': content})

            # Test redirect
            self.assertEqual(response.status_code, 302)
            self.assertEqual(response.location,'/users/4')


            user = User.get_user_by_id(4)

            # Tests if post was added to user
            self.assertEqual(user.posts[0].title, title)
            self.assertEqual(user.posts[0].content, content)


    def test_view_post_page(self):
        "Tests if the /posts/<int:post_id> will show the requested post"
        with self.client:
            add_some_users()
            add_some_posts()

            response = self.client.get(f'/posts/10')
            html = response.get_data(as_text = True)

            self.assertIn('Title9', html)
            self.assertEqual(response.status_code, 200)


    def test_delete_post(self):
        "Tests the /posts/<int:post_id>/delete post request which should delete the selected post from the database"
        with self.client:
            add_some_users()
            add_some_posts()            

            with app.app_context():
                user = User.get_user_by_id(1)
                post6 = Post.get_post_by_id(6)
                user_posts = user.posts

            # This shows that before deleting post 6, it is in the list of posts for user 1
            self.assertEqual(post6 in user_posts,True)
                

            response = self.client.post('/posts/6/delete',data={"deletePost": 1})

            # Test redirect
            self.assertEqual(response.status_code, 302)
            self.assertEqual(response.location,'/users/1')

            with app.app_context():
                user = User.get_user_by_id(1)
                user_posts = user.posts

            # Tests if post was deleted
            self.assertEqual(post6 in user_posts,False)


    def test_edit_selected_post(self):
        "Tests the /posts/<int:post_id>/edit post request which should save the changes of a post to the database"
        with self.client:
            add_some_users()
            add_some_posts()            

            with app.app_context():
                post15 = Post.get_post_by_id(15)

            self.assertEqual(post15.title == 'Title14',True)

            response = self.client.post('/posts/15/edit',data={'title': 'New Title to Test Edit Post', 'content': 'Some text to test edit post.'})

            with app.app_context():
                post15 = Post.get_post_by_id(15)

            self.assertEqual(post15.title == 'New Title to Test Edit Post',True)

    def test_tags_page(self):
        "Test the /tags link which should show all a list of all tags"
        with self.client:
            add_some_tags()

            response = self.client.get('/tags')
            html = response.get_data(as_text = True)

            self.assertIn('"/tags/7"> Nature </a></li>', html)
            self.assertEqual(response.status_code, 200)

    def test_tag_info_page(self):
        "Test the /tags/<int:tag_id> page which should show the information of a tag and associated posts"
        with self.client:
            add_some_users()
            add_some_posts()
            add_some_tags()
            add_post_tag_remationships()

            response = self.client.get('/tags/5')
            html = response.get_data(as_text = True)

            self.assertIn('<li><a href="/posts/20">Title19</a></li>', html)
            self.assertEqual(response.status_code, 200)


    def test_delete_tag(self):
        """Tests the delete tag link"""
        with self.client:
            add_some_users()
            add_some_posts()
            add_some_tags()
            add_post_tag_remationships()

            with app.app_context():
                all_tags = Tag.query.all()
                posttags = Post.get_post_by_id(20).tags
                tag5 = Tag.get_tag_by_id(5)
            self.assertEqual(tag5 in posttags, True)

            self.assertEqual(tag5 in all_tags, True)

            response = self.client.post('/tags/5/delete')

            all_tags = Tag.query.all()
            self.assertEqual(tag5 in all_tags, False)

            with app.app_context():
                posttags = Post.get_post_by_id(20).tags
            self.assertEqual(tag5 in posttags, False)










