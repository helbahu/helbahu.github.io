from flask import Blueprint, render_template,redirect,flash, g,request,session,jsonify,make_response
from models import Healthcare_Professionals,API_Requests,Assessment_Questions,GetQuestions
from forms import SymptomForm_suggested_questions

questions_bp = Blueprint('assessment_questions',__name__,template_folder='/templates')


# ASSESSMENT QUESTIONS: EDIT, DELETE ------------------------------------------------------------------------------------------PART06
@questions_bp.route('/assessment/<assessment_id>/edit_question/<question_name>',methods=["GET","POST"])
def edit_question(assessment_id,question_name):
    if not g.user:
        return redirect('/register')
    
    # NOTE: the json file may be sorted later by name and this function should be changed to 
    # a divide and concquer funciton to improve time complexity.

    question = GetQuestions.get_question_by_name(question_name)    

    form = SymptomForm_suggested_questions()

    if isinstance(g.user,Healthcare_Professionals):
        form.questions.choices = [(question_name,question.get('text'))]
    else:
        form.questions.choices = [(question_name,question.get('laytext'))]

    if form.validate_on_submit():
        question = form.questions.data
        answer = form.answer.data

        if session.get("assessment"):
            result = API_Requests.UpdateQuestion({"assessment":{"id":assessment_id}},question,answer)

            assessment = session.get("assessment") 
            for q in assessment.get('questions'):

                if q.get('question') == question:
                    q['answer'] = answer

            assessment['suggestions'] = result
            session["assessment"] = assessment
            flash(f'Question updated successfully.','success')
            return redirect(f'/{g.user.username}/assessment/summary')            

        else:
            Assessment_Questions.update_assessment_question(assessment_id,question_name,answer)
            flash(f'Question updated successfully.','success')
            return redirect(f'/assessment/{assessment_id}')


    return render_template('edit_question.html',form=form,user=g.user)


@questions_bp.route('/assessment/<assessment_id>/delete_question/<question_name>',methods=['POST'])
def delete_question(assessment_id,question_name):
    req = request.get_json()
    delete = req.get('delete_question')

    if delete:
        if session.get("assessment"):
            result = API_Requests.DeleteQuestion(assessment_id,question_name)

            assessment = session.get("assessment") 
            for q in assessment.get('questions'):

                if q.get('question') == question_name:
                    assessment['questions'] = [i for i in assessment.get('questions') if i.get('question') != question_name]

            assessment['suggestions'] = result
            session["assessment"] = assessment

            res = make_response(jsonify({"message":"Question deleted successfully.",'deleted': True}),200)        
        else:
            result = Assessment_Questions.delete_question(assessment_id,question_name)
            res = make_response(jsonify({"message":"Question deleted successfully.",'deleted': result}),200)        

        return res

