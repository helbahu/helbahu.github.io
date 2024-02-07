from models import User,Post,Tag,PostTag,db
from app import app
import lorem
from random import randint

with app.app_context():
    db.drop_all()
    db.create_all()


# Generate some Users
fNames = ['Andrew','Cindy','Charles','Rene','Terrence','Tito','Jose','Sarah','Raymond','Simon','Nicole']
lNames = ['Jackson','Lebowski','Chavez','Dupont','Yeates','Esposito','Sanchez','Lamos','Wilder','Lentz','Brown']

people = [User(first_name = f,last_name = l) for f,l in zip(fNames,lNames)]

with app.app_context():
    db.session.add_all(people)
    db.session.commit()


fNames = ['Maya','Laura','Nora','Carlos','Billy','Xiaoyu','Siobhan','Brenda','Kevin']
lNames = ['Cruz','Jamison','Petrovic','Silva','Meyers','Chen','O\'brien','Lewis','Stone']
profile_imgs = ['https://img.freepik.com/premium-vector/girl-s-face-with-beautiful-smile-female-avatar-website-social-network_499739-527.jpg',
                'https://static.vecteezy.com/system/resources/previews/006/735/770/original/beautiful-woman-avatar-profile-icon-vector.jpg',
                'https://static.vecteezy.com/system/resources/thumbnails/004/899/680/small/beautiful-blonde-woman-with-makeup-avatar-for-a-beauty-salon-illustration-in-the-cartoon-style-vector.jpg',
                'https://www.shutterstock.com/image-vector/man-blue-shirt-glasses-portrait-260nw-394989256.jpg',
                'https://static.vecteezy.com/system/resources/previews/004/476/164/original/young-man-avatar-character-icon-free-vector.jpg',
                'https://cdn3.vectorstock.com/i/1000x1000/54/72/cute-woman-face-cartoon-vector-23305472.jpg',
                'https://cdn5.vectorstock.com/i/1000x1000/54/74/cute-woman-face-cartoon-vector-23305474.jpg',
                'https://img.freepik.com/premium-vector/woman-profile-cartoon_18591-58476.jpg',
                'https://img.freepik.com/premium-vector/businessman-avatar-cartoon-character-profile_18591-50136.jpg'
                ]

people_with_images = [User(first_name = f,last_name = l, image_url = i) for f,l,i in zip(fNames,lNames,profile_imgs)]


with app.app_context():
    db.session.add_all(people_with_images)
    db.session.commit()


# Generate some Posts
posts = []
for i in range(40):
    t = f'Title{i}: {lorem.get_word(count=randint(1,6), func="capitalize")}'
    c = lorem.get_sentence(count=randint(1,4), word_range=(8, 20))
    u = randint(1,20)
    post = Post(title= t, content= c, user_id= u)
    posts.append(post)

with app.app_context():
    db.session.add_all(posts)
    db.session.commit()


# Generate some Tags
all_tags = []
tags = ['Funny','Sad','Exciting','Vacation','Holidays','Birthday','Fun','Scary','Something Interesting','Life Hacks','Cooking','Book Recommendations','Movies','Food & Drink','Entertainment','Art','Wild Experiences']
for tag in tags:
    t = Tag(tag_name = tag)
    all_tags.append(t)

with app.app_context():
    db.session.add_all(all_tags)
    db.session.commit()


# Generate some PostTag relationships
all_post_tag_relationships = []
post_set_test = set([])
for i in range(60):
    post_id = randint(1,40)
    tag_id = randint(1,10)
    tup = (post_id,tag_id)
    pt = PostTag(post_id = post_id, tag_id = tag_id)
    if not tup in post_set_test:
        all_post_tag_relationships.append(pt)
        post_set_test.add(tup)

with app.app_context():
    db.session.add_all(all_post_tag_relationships)
    db.session.commit()
