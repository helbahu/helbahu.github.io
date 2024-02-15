"""Flask app for Cupcakes"""
from flask import Flask, request, redirect, render_template, flash, jsonify 
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Cupcake

from form import AddCupcakeForm

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

app.config['SECRET_KEY'] = 'bloglyappSecretKey123'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

#ensures debugging is activated
# app.debug = True

debug = DebugToolbarExtension(app)

connect_db(app)

@app.route('/')
def homepage():
    form = AddCupcakeForm()
    return render_template('base.html',form=form)

@app.route('/api/cupcakes')
def get_cupcakes():
    cupcakes = Cupcake.get_all_cupcakes_serialized()
    return jsonify(cupcakes = cupcakes)

@app.route('/api/cupcakes',methods=['POST'])
def add_new_cupcake():
    form = AddCupcakeForm()
    if form.validate_on_submit():
        form_obj = {f'{e.name}': e.data for e in form if e.name != 'csrf_token'}
        new_cupcake = Cupcake.new_cupcake(form_obj)
        return redirect('/')
    else:

        new_cupcake = Cupcake.new_cupcake(request.json)
        response_json = jsonify(cupcake=new_cupcake)
        return (response_json,201)

@app.route('/api/cupcakes/<int:cupcake_id>')
def get_cupcake_info(cupcake_id):
    cupcake = Cupcake.get_cupcake_by_id_serialized(cupcake_id)
    return jsonify(cupcake=cupcake)

@app.route('/api/cupcakes/<int:cupcake_id>',methods=['PATCH'])
def update_cupcake(cupcake_id):
    update_cupcake = Cupcake.update_cupcake(cupcake_id,request.json)
    return jsonify(cupcake = update_cupcake)

@app.route('/api/cupcakes/<int:cupcake_id>',methods=['DELETE'])
def delete_cupcake(cupcake_id):
    Cupcake.delete_cupcake_by_id(cupcake_id)
    return jsonify(message = 'Deleted')

