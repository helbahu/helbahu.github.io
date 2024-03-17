"""Seed database with sample data from CSV Files."""

from csv import DictReader
from app import db,app
from models import User, Message, Follows
from random import choice, randint

with app.app_context():
    db.drop_all()
    db.create_all()

with app.app_context():

    with open('generator/users.csv') as users:
        db.session.bulk_insert_mappings(User, DictReader(users))

    with open('generator/messages.csv') as messages:
        db.session.bulk_insert_mappings(Message, DictReader(messages))

    with open('generator/follows.csv') as follows:
        db.session.bulk_insert_mappings(Follows, DictReader(follows))

    db.session.commit()





with app.app_context():

    all_users = User.query.all()
    all_messages = Message.query.all()
    for user in all_users:
        like_num = randint(0,6)
        n = 0
        while n <= like_num:
            msg = choice(all_messages)
            if msg not in user.messages and msg not in user.likes:
                user.likes.append(msg)
            n += 1

    db.session.add_all(all_users)
    db.session.commit()



