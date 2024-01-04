from flask import Flask, render_template, request
from flask_debugtoolbar import DebugToolbarExtension
from random import randint, choice

from story_instances import myStories
story = None

app = Flask(__name__)

#ensures debugging is activated
app.debug = True

#enables and instantiates a toolbar
app.config['SECRET_KEY'] = "test-secret-key"
debug = DebugToolbarExtension(app)


@app.route('/')
def main_page():
    stories_keys = list(myStories.keys())
    return render_template('main.html',stories = stories_keys)

@app.route('/madlib-story')
def madlib():
    global story
    s = request.args['stories']
    if s == 'random':
        story = choice(list(myStories.values()))
    else:
        story = myStories[s]
    return render_template('madlib.html', story_prompts = story.prompts)

@app.route('/story')
def generate_madlib():
    args = request.args
    args_dict = {f'{k}': args[k] for k in story.prompts}
    mystory = story.generate(args_dict)

    return str(mystory)

