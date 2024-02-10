from models import db, Pet
from app import app
import lorem
from random import randint

with app.app_context():
    db.drop_all()
    db.create_all()

names = ['Fuzzy','Max','Millie','Rocky','Theo','Fifi','Lola','Bailey','Tina','Coco','Felix','Sasha','Molly','Rover', 'Daisy','Luna','Buddy','Teddy','Leo','Rosie']
species = ['Porcupine','Dog','Cat','Dog','Cat','Cat','Dog','Dog','Cat','Porcupine','Dog','Cat','Porcupine','Dog','Dog','Dog','Dog','Cat','Dog','Dog']

photo_urls = [
    'https://www.thesprucepets.com/thmb/Yu79mdSxOPWIV-snCkRljL-bMDA=/2075x0/filters:no_upscale():strip_icc()/GettyImages-626916125-5b3a4a8046e0fb00379f682d.jpg',
    'https://cff2.earth.com/uploads/2023/08/26042949/National-Dog-Day--scaled.jpg',
    'https://th-thumbnailer.cdn-si-edu.com/ii_ZQzqzZgBKT6z9DVNhfPhZe5g=/fit-in/1600x0/filters:focal(1061x707:1062x708)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/55/95/55958815-3a8a-4032-ac7a-ff8c8ec8898a/gettyimages-1067956982.jpg',
    'https://www.hartz.com/wp-content/uploads/2022/04/small-dog-owners-1.jpg',
    'https://wallpapers.com/images/featured/cat-pictures-zc3gu0636kmldm04.jpg',
    'https://image.petmd.com/files/styles/863x625/public/2023-09/how-smart-are-cats.jpg',
    'https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/12153852/American-Eskimo-Dog-standing-in-the-grass-in-bright-sunlight-400x267.jpg',
    'https://people.com/thmb/WxJfkZ3MCkXFhY1GgWzuJLqDgDc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(1019x626:1021x628)/dog-dating-2522ccf2b0e04f94a29f25fdb81d79af.jpg',
    'https://media.4-paws.org/a/5/3/7/a537f08d227326121b80790ba54036498668c9c8/VIER%20PFOTEN_2016-07-08_011-4993x3455-1920x1329.jpg',
    'https://www.thesprucepets.com/thmb/I5PxSFtWkisX8EDF91FYhbAw9eY=/1900x0/filters:no_upscale():strip_icc()/GettyImages-902464552-5c89112f4cedfd000190b25f.jpg',
    'https://image.petmd.com/files/styles/978x550/public/dog-allergies.jpg',
    'https://media.npr.org/assets/img/2021/08/11/gettyimages-1279899488_wide-f3860ceb0ef19643c335cb34df3fa1de166e2761-s1100-c50.jpg',
    'https://i0.wp.com/ilovepets.co/wp-content/uploads/2015/10/prehensile-tailed-porcupine.jpg?resize=418%2C380&ssl=1',
    'https://www.cdc.gov/healthypets/images/pets/cute-dog-headshot.jpg?_=42445',
    'https://cdn-prod.medicalnewstoday.com/content/images/articles/322/322868/golden-retriever-puppy.jpg',
    'https://www.aspca.org/sites/default/files/dog-care_general-dog-care_main-image.jpg',
    'https://www.forbes.com/advisor/wp-content/uploads/2023/05/great_dane.jpeg.jpg',
    'https://snworksceo.imgix.net/ufa/01813891-c850-4172-bcce-2a701f59e063.sized-1000x1000.jpg?w=1000',
    'https://media.4-paws.org/d/1/2/d/d12ded56e915c084dd0d82b1fe1cf0c477a2a0ef/VIER%20PFOTEN_2021-10_22_00109-2815x1948-1920x1329.jpg',
    'https://thevillagevets.com/wp-content/uploads/2022/03/6-causes-of-dog-snorting.jpg',    
]
ages = [2,5,8,3,2,4,6,8,11,3,7,7,5,9,12,7,9,14,6,8]

available = ['Available','Available','Available','Available','Available','Available','Not Available','Available','Not Available','Available',
             'Available','Available','Available','Not Available','Available','Available','Available','Available','Not Available','Available'
             ]

all_pets = []
for i in range(20):
    pet = Pet(name=names[i], species=species[i],photo_url=photo_urls[i],age=ages[i],available=available[i])
    all_pets.append(pet)
with app.app_context():
    db.session.add_all(all_pets)
    db.session.commit()

