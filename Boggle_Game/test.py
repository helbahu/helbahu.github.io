from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle
from time import time

class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!

    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config['TESTING'] = True
        app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

    def test_homepage(self):
        """Make sure information is in the session and HTML is displayed"""

        with self.client:
            response = self.client.get('/')
            self.assertIn('board', session)
            self.assertEqual(session['board'],[])
            self.assertIn(b'<button class="col-8 btn btn-info btn-lg" type="submit" name="pageSelect" value="play">Play</button>', response.data)

    def test_instructions_page(self):
        with self.client:
            response = self.client.get('/instructions')
            self.assertIn(b'<h2 class="title">How to Play</h2>',response.data)            

    def test_achievements_page(self):
        with self.client:
            response = self.client.get('/achievements')
            self.assertIn(b'<h2 class="title">Achievements</h2>',response.data)            

            with self.client.session_transaction() as change_session:
                change_session['game_count'] = 10
            response = self.client.get('/achievements')
            self.assertIn(b'<div class="h2">Games Played</div>\n        <div class="h2">10</div>',response.data)            
            

    def test_page_redirect(self):

        with self.client:
            # Redirect to achievements page
            resp = self.client.get('/page_redirect?pageSelect=achievements')
            self.assertEqual(resp.status_code, 302)
            self.assertEqual(resp.location,'/achievements')

            # Redirect to instuctions page
            resp = self.client.get('/page_redirect?pageSelect=instructions')
            self.assertEqual(resp.status_code, 302)
            self.assertEqual(resp.location,'/instructions')

            # Redirect to homepage
            resp = self.client.get('/page_redirect?pageSelect=')
            self.assertEqual(resp.status_code, 302)
            self.assertEqual(resp.location,'/')

            resp = self.client.get('/page_redirect?pageSelect=save_and_home')
            self.assertEqual(resp.status_code, 302)
            self.assertEqual(resp.location,'/')

            # Redirect to game page
            resp = self.client.get('/page_redirect?pageSelect=play')
            self.assertEqual(resp.status_code, 302)
            self.assertEqual(resp.location,'/play')

            board = session['board']
            self.assertEqual(len(board),5)
            self.assertEqual(len(board[0]),5)

            resp = self.client.get('/page_redirect?pageSelect=save_and_restart')
            self.assertEqual(resp.status_code, 302)
            self.assertEqual(resp.location,'/play')


    def test_play_game(self):
        with self.client:
            with self.client.session_transaction() as change_session:
                change_session['init_time'] = time()
                boggle_game = Boggle()
                board = boggle_game.make_board()        
                board[2][0] = "Q"
                change_session['board'] = board

            response = self.client.get('/play')
            self.assertIn(b'<div class="board_box" id="2-0">Q</div>',response.data)            
 
    def test_submit_word(self):
        with self.client:
            with self.client.session_transaction() as change_session:
                board = [['A','B','B','B','B'],
                         ['B','P','B','B','B'],
                         ['B','B','P','L','B'],
                         ['B','B','B','L','B'],
                         ['B','B','B','B','E'],
                         ]
                change_session['longestWord'] = ""
                change_session['score'] = 0
                change_session['board'] = board
                change_session['wordSet'] = ['BELL']

            #Valid Word
            response = self.client.post('/submit_word',json={'word': 'APPLE'})
            res = response.get_data(as_text = True)
            self.assertEqual(response.status_code,200)
            self.assertIn('"message": "Great Job! +5 Points"',res)
            self.assertEqual(session['score'],5)

            #Valid Word Not on Board
            response = self.client.post('/submit_word',json={'word': 'PALE'})
            res = response.get_data(as_text = True)
            self.assertEqual(response.status_code,200)
            self.assertIn('"message": "Rule Reminder:',res)

            # Invalid Word 
            response = self.client.post('/submit_word',json={'word': 'APPL'})
            res = response.get_data(as_text = True)
            self.assertEqual(response.status_code,200)
            self.assertIn('"message": "APPL is not a valid word."',res)

            # Duplicate Word
            response = self.client.post('/submit_word',json={'word': 'BELL'})
            res = response.get_data(as_text = True)
            self.assertEqual(response.status_code,200)
            self.assertIn('"message": "Duplicate Word"',res)

    def test_update_stats(self):
        with self.client:
            with self.client.session_transaction() as change_session:
                change_session['high_score'] = 30
                change_session['game_count'] = 4
                change_session['score'] = 28
                change_session['longest_word_record'] = 'BIRD'
                change_session['longestWord'] = 'CHICKEN'
            response = self.client.post('/update_stats',json={'status': 'game_over'})
            self.assertEqual(session['high_score'],30)
            self.assertEqual(session['longest_word_record'],'CHICKEN')
            self.assertEqual(session['game_count'],5)
