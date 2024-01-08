from flask import Flask, render_template, request, redirect, flash, session
from flask_debugtoolbar import DebugToolbarExtension

from surveys import surveys


# GLOBALVARIABLES
# session['user_responses'] = {}  #Dictionary with the key as the surveys key, and the value is the respective responses list
# session['responses'] = []

app = Flask(__name__)

#ensures debugging is activated
app.debug = True

#enables and instantiates a toolbar
app.config['SECRET_KEY'] = "test-secret-key2"
debug = DebugToolbarExtension(app)


def clear_responses():
    session['responses'] = []

def add_response(response):
    responses = session['responses'] 
    responses.append(response)
    session['responses'] = responses


@app.route('/')
def home_page():
    clear_responses()
    return render_template('base.html',surveys=surveys.items())


@app.route('/survey')
def survey_redirect():
    try:
        selected_survey = request.args["start_survey"]
        return redirect (f'/survey/{selected_survey}')
    except:
        flash("Invalid link. Redirected to homepage.", "warning")
        return redirect ('/')


@app.route('/survey/<selected_survey>')
def survey_page(selected_survey):
    try:
        clear_responses()
        survey = surveys[selected_survey]
        link = f'/survey/{selected_survey}'
        return render_template('survey.html',survey = survey,link = link)
    except:
        flash("Invalid link. Redirected to homepage.", "warning")
        return redirect ('/')


@app.route('/survey/<selected_survey>/questions')
def next_question(selected_survey):
    try:

        c = request.args.get('choice')
        comment = request.args.get('comment')
        if c:
            if comment:
                add_response({f'{c}': comment})
            else:
                add_response(c)

        arg = request.args['q_num']

        if arg != "complete":
            q_num = int(arg)
            link = f'/survey/{selected_survey}/questions/{q_num}'
            return redirect (f'{link}') 
        else:
            link = f'/survey/{selected_survey}/thank_you'
            survey = surveys[selected_survey]
            flash(f"Congratulations. You have successfully completed the {survey.title}!", "success")
            return redirect (f'{link}') 

    except:
        flash("Invalid link. Redirected to homepage.", "warning")
        return redirect ('/')


@app.route('/survey/<selected_survey>/questions/<int:num>')
def current_question(selected_survey,num):
    try:
        survey = surveys[selected_survey]
        if len(session['responses']) == num:
            question = survey.questions[num] 
            last_q = len(survey.questions)
            link = f'/survey/{selected_survey}/questions'
            n = num + 1
            return render_template('question.html',survey = survey, link = link, q_num = n,q = question, last_q = last_q)
        elif len(session['responses']) == 0:
            flash(f"You have not statret the {survey.title}.", "warning")
            return redirect(f'/survey/{selected_survey}')
        else:
            l = len(session['responses'])
            flash(f"Please complete the survey in order.", "warning")
            return redirect(f'/survey/{selected_survey}/questions/{l}')
    except:
        flash("Invalid link. Redirected to homepage.", "warning")
        return redirect ('/')


@app.route('/survey/<selected_survey>/thank_you')
def thank_you(selected_survey):
    if session.get('user_responses'):
        user_responses = session['user_responses']
        user_responses[selected_survey] = session['responses']
        session['user_responses'] = user_responses
    else:
        user_responses = {f'{selected_survey}': session['responses']}
        session['user_responses'] = user_responses
    clear_responses()
    survey = surveys[selected_survey]
    return render_template('thank_you.html',survey = survey)




