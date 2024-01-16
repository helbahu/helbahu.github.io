from flask import Flask, render_template, request, redirect, flash, session
from flask import jsonify, make_response
from flask_debugtoolbar import DebugToolbarExtension
from time import time
from boggle import Boggle

# Session Variables
    #session['board']
    #session['wordSet']
    #session['score']
    #session['longestWord']
    #session['init_time']

    #NOTE: These variables won't be reset at the end of each game
    #session['game_count']
    #session['high_score']
    #session['longest_word_record']

def reset_session_variables():
    "Resets session variables"
    session['board'] = []
    session['wordSet'] = []
    session['score'] = 0
    session['longestWord'] = ""
    session['init_time'] = time()

boggle_game = Boggle()


app = Flask(__name__)

#ensures debugging is activated
app.debug = True

#enables and instantiates a toolbar
app.config['SECRET_KEY'] = "test-secret-key2" 
debug = DebugToolbarExtension(app)


@app.route('/')
def home_page():
    reset_session_variables()

    return render_template('base.html')


@app.route('/page_redirect')
def page_redirect():
    req = request.args['pageSelect']

    if req == 'save_and_home':
        return redirect(f"/")

    if (req == 'play') or (req == 'save_and_restart'):
        reset_session_variables()
        board = boggle_game.make_board()        
        session['board'] = board

        req = 'play'

    return redirect(f"/{req}")


@app.route('/instructions')
def instructions_page():
    return render_template('instructions.html')


@app.route('/achievements')
def achievements_page():
    highscore = session.get('high_score')
    if not highscore:
        highscore = '-'
    longestWord = session.get('longest_word_record')
    if not longestWord:
        longestWord = '-'    
    game_count = session.get('game_count')
    if not game_count:
        game_count = 0

    return render_template('achievements.html', high_score = highscore, longest_word = longestWord, game_count = game_count)


@app.route('/play')
def play_boggle():
    board = session.get('board')
    score = session.get('score')
    longestWord = session.get('longestWord')
    elapsed_time = time() - float(session['init_time'])

    return render_template('play_boggle.html', board = board, score = score, longestWord = longestWord, elapsed_time = elapsed_time)


@app.route('/submit_word',methods=['POST'])
def submit_word():
    req = request.get_json()
    word = req["word"]
    wordSet = set(session.get('wordSet'))

    if {word}.issubset(wordSet):
        res = make_response(jsonify({'message': 'Duplicate Word', 'class': 'warning'}),200)
    else:  
        board = session.get('board')
        result = boggle_game.check_valid_word(board, word)

        if result == "ok":
            longestWord = session.get('longestWord')
            if len(word) > len(longestWord):
                longestWord = word
                session['longestWord'] = word
            score = int(session.get('score'))
            score += len(word)
            session['score'] = score
            wordSet.add(word)
            session['wordSet'] = list(wordSet)
            res = make_response(jsonify({'message': f'Great Job! +{len(word)} Points', 'class': 'success', 'score': score, 'longestWord': longestWord}),200)

        elif result == "not-on-board":
            res = make_response(jsonify({'message': 'Rule Reminder: Words are only valid when you connect adjacent letters horizontally, vertically, or diagonally.', 'class': 'warning'}),200)

        elif result == "not-word":
            res = make_response(jsonify({'message': f'{word} is not a valid word.', 'class': 'warning'}),200)

        else:
            res = make_response(jsonify({'message': 'Invalid Input', 'class': 'warning'}),200)

    return res


@app.route('/update_stats',methods=['POST'])
def update_stats():
    req = request.get_json()
    res = make_response(jsonify({'message': 'Updated stats'}),200)

    if req["status"] == "game_over":
        game_count = session.get('game_count')
        highscore = session.get('high_score')
        score = session.get('score')
        longestWord = session.get('longestWord')

        if not game_count:
            session['game_count'] = 1
        else:
            num = int(session['game_count'])
            num += 1
            session['game_count'] = num

        if not highscore:
            session['high_score'] = score
            session['longest_word_record'] = longestWord

        else:
            l_word = len(session.get('longest_word_record'))

            if score > int(highscore):
                session['high_score'] = score
            if len(longestWord) > l_word:
                session['longest_word_record'] = longestWord

    return res
