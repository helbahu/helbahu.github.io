from flask import Blueprint, g,request,make_response,jsonify,redirect
from models import GetQuestions

question_requests_bp = Blueprint('question_requests',__name__,template_folder='/templates')


@question_requests_bp.route('/filter_questions',methods=["POST"])
def filter_questions():
    if not g.user:
        return redirect('/register')
    
    req = request.get_json()
    res = GetQuestions.filter_questions(req)

    return res


@question_requests_bp.route('/get_question_details',methods=["POST"])
def get_question_details():
    req = request.get_json()

    q = GetQuestions.get_question_by_name(req.get("name"))

    if q:
        res = make_response(jsonify({'message': 'Success','result_question': q}),200)
    else:
        res = make_response(jsonify({'message': 'Failure','result_question': None}),200)        

    return res

