from models import User,Post, db
from app import app
import lorem
from random import randint

with app.app_context():
    db.drop_all()
    db.create_all()

fNames = ['Andrew','Cindy','Charles','Rene','Terrence','Tito','Jose','Sarah']
lNames = ['Jackson','Lebowski','Chavez','Dupont','Yeates','Esposito','Sanchez','Lamos']

people = [User(first_name = f,last_name = l) for f,l in zip(fNames,lNames)]

with app.app_context():
    db.session.add_all(people)
    db.session.commit()


fNames = ['Maya','Laura','Nora','Carlos','Billy','Xiaoyu','Siobhan']
lNames = ['Cruz','Jamison','Petrovic','Silva','Meyers','Chen','O\'brien']
profile_imgs = ['https://img.freepik.com/premium-vector/girl-s-face-with-beautiful-smile-female-avatar-website-social-network_499739-527.jpg',
                'https://static.vecteezy.com/system/resources/previews/006/735/770/original/beautiful-woman-avatar-profile-icon-vector.jpg',
                'https://static.vecteezy.com/system/resources/thumbnails/004/899/680/small/beautiful-blonde-woman-with-makeup-avatar-for-a-beauty-salon-illustration-in-the-cartoon-style-vector.jpg',
                'https://www.shutterstock.com/image-vector/man-blue-shirt-glasses-portrait-260nw-394989256.jpg',
                'https://static.vecteezy.com/system/resources/previews/004/476/164/original/young-man-avatar-character-icon-free-vector.jpg',
                'https://cdn3.vectorstock.com/i/1000x1000/54/72/cute-woman-face-cartoon-vector-23305472.jpg',
                'https://cdn5.vectorstock.com/i/1000x1000/54/74/cute-woman-face-cartoon-vector-23305474.jpg'
                ]

people_with_images = [User(first_name = f,last_name = l, image_url = i) for f,l,i in zip(fNames,lNames,profile_imgs)]


with app.app_context():
    db.session.add_all(people_with_images)
    db.session.commit()


posts = []
for i in range(20):
    t = f'Title{i}'
    c = lorem.get_sentence(count=randint(1,4), word_range=(8, 20))
    u = randint(1,15)
    post = Post(title= t, content= c, user_id= u)
    posts.append(post)

with app.app_context():
    db.session.add_all(posts)
    db.session.commit()



