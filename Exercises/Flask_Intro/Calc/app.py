# Put your app in here.
from operations import add, sub, mult, div
from flask import Flask, request

app = Flask(__name__)

def a_b_list():
    a = int(request.args['a'])
    b = int(request.args['b'])
    return [a,b]

@app.route('/add')
def add_opp():
    return f"{add(*a_b_list())}" 

@app.route('/sub')
def sub_opp():
    return f"{sub(*a_b_list())}" 

@app.route('/mult')
def mult_opp():
    return f"{mult(*a_b_list())}" 

@app.route('/div')
def div_opp():
    return f"{div(*a_b_list())}" 


#MATH ROUTE with operations as parameters
math_dict = {
    "add": add,
    "sub": sub,
    "mult": mult,
    "div": div
}

@app.route('/math/<opp>')
def math_opp(opp):
    return f"{math_dict[opp](*a_b_list())}"
