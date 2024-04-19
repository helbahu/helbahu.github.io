from flask import Blueprint, render_template,redirect,flash, g,request,session,jsonify,make_response
from models import Healthcare_Professionals,Assessment,GetQuestions,Assessment_Questions,Patient
from forms import ReviewAssessmentForm,SymptomForm_suggested_questions
import json

review_bp = Blueprint('review_followup',__name__,template_folder='/templates')


# REVIEW ASSESSMENT, FOLLOW-UP QUESTIONS --------------------------------------------------------------------------------------PART04
@review_bp.route('/assessment/<assessment_id>/review_assessment',methods=["GET","POST"])
def review_assessment(assessment_id):
    if not g.user or not isinstance(g.user,Healthcare_Professionals) or g.user.title != 'Doctor':
        return redirect('/')
    if not g.user.is_verified:
        return redirect('/')

    assessment = Assessment.query.filter_by(id=assessment_id).one()
    patient = assessment.patient

    answered_questions = [q.question_name for q in assessment.questions]

    form = ReviewAssessmentForm(obj=assessment)

    follow_up_questions = assessment.follow_up_questions

    with open('SymptomsOutput.json') as file: 
        data = json.load(file)
        form.questions.choices = [(q["name"],q["text"]) for q in data if q["name"] not in answered_questions]
        follow_up_questions = [(q["name"],q["text"]) for q in data if q["name"] in follow_up_questions]

    with open('symptomslist.json') as file: 
        data = json.load(file)
        form.symptomList.choices = [(i.get("label"),i.get("label")) for i in data if isinstance(i,dict)]

    with open('DiseasesOutput.json') as file: 
        data = json.load(file)
        form.official_diagnosis.choices = [('None','None'),*[(q["name"],q["text"]) for q in data]]

    if form.validate_on_submit():
        notes = form.notes.data
        official_diagnosis = form.official_diagnosis.data

        assessment.review(notes,official_diagnosis)

        return redirect(f'/assessment/{assessment_id}')

    return render_template('review_assessmentform.html',form=form,user=g.user,assessment_id=assessment_id,follow_up_questions=follow_up_questions)


@review_bp.route('/assessment/<assessment_id>/follow_up_questions',methods=["GET","POST"])
def assessment_follow_up_questions(assessment_id):
    if not g.user:
        return redirect('/')
    if not isinstance(g.user,Patient) and not g.user.is_verified:
        return redirect('/')


    assessment = Assessment.query.filter_by(id=assessment_id).one()
    follow_up_questions = assessment.follow_up_questions

    form = SymptomForm_suggested_questions()

    if isinstance(g.user,Patient) and g.user.username != assessment.patient.username:
        return redirect('/')


    if follow_up_questions:
        question = GetQuestions.get_question_by_name(follow_up_questions[0])
        question = (question["name"],question["text"],question["laytext"])

        if isinstance(g.user,Healthcare_Professionals):
            form.questions.choices = [(question[0],f'{question[1]}')]
        else:
            form.questions.choices = [(question[0],f'{question[2]}')]
    else:
        return redirect(f'/assessment/{assessment_id}')

    if form.validate_on_submit():
        question = form.questions.data
        answer = form.answer.data

        # API_Requests.UpdateQuestion({"assessment":{"id":assessment_id}},question,answer)
        Assessment_Questions.add_assessment_question(assessment_id,question,answer)
        Assessment.remove_follow_up_question(assessment_id,question)

        return redirect(f'/assessment/{assessment_id}/follow_up_questions')


    follow_up_questions_remaining = len(follow_up_questions)
    # 84599


    return render_template('followup_symptomform.html',form=form,user=g.user,assessment_id=assessment_id,follow_up_questions_remaining=follow_up_questions_remaining)


@review_bp.route('/review_assessment/add_follow_up_question',methods=['POST'])
def add_follow_up_question():
    if not g.user:
        return redirect('/register')

    req = request.get_json()

    assessment_id = req.get('assessment_id')
    question = req.get('question')

    if assessment_id:
        assessment = Assessment.add_follow_up_question(assessment_id,question)

        follow_up_questions = assessment.follow_up_questions

        follow_up_questions_data = []
        for q_name in follow_up_questions:
            q = GetQuestions.get_question_by_name(q_name)
            follow_up_questions_data.append((q["name"],q["text"]))

        res = make_response(jsonify({"message":'Success','follow_up_questions':follow_up_questions_data}),200)        
    else:
        res = make_response(jsonify({"message":'Failed','follow_up_questions':None}),200)        

    return res

@review_bp.route('/review_assessment/remove_follow_up_question',methods=['POST'])
def remove_follow_up_question():
    if not g.user:
        return redirect('/register')

    req = request.get_json()

    assessment_id = req.get('assessment_id')
    question = req.get('question')

    if assessment_id:
        Assessment.remove_follow_up_question(assessment_id,question)
        res = make_response(jsonify({"message":'Success','removed':True}),200)        
    else:
        res = make_response(jsonify({"message":'Failed','removed':False}),200)        

    return res
