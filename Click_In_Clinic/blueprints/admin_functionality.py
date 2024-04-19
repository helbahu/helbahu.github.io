from flask import Blueprint, render_template,redirect,flash, g,request,make_response,jsonify
from models import Healthcare_Professionals,Patient,Admin,Institution
from forms import AddInstitutionForm
import json

admin_bp = Blueprint('admin_functionality',__name__,template_folder='/templates')


# ADMIN FUNCTIONALITY: VERIFICATION, MAKE ADMIN, ADD INSTITUTION,DELETE USER --------------------------------------------------------------------PART07
@admin_bp.route('/verification')
def hcp_verification():
    if not g.user or isinstance(g.user,Patient) or not g.user.is_admin:
        return redirect('/register')

    if isinstance(g.user,Healthcare_Professionals):
        all_unverified_hcps = Healthcare_Professionals.query.filter_by(is_verified = False,institution_id = g.user.institution_id).all()
    else:
        all_unverified_hcps = Healthcare_Professionals.query.filter_by(is_verified = False).all()

    return render_template('verification.html', hcps = all_unverified_hcps)


@admin_bp.route('/verification',methods=["POST"])
def verify_hcp():
    if not g.user or isinstance(g.user,Patient) or not g.user.is_admin:
        return redirect('/register')

    req = request.get_json()
    username = req.get("username")

    Admin.verify_hcp(username)

    res = make_response(jsonify({'message': f'The user {username} is verified.'}),200)        

    return res

@admin_bp.route('/make_admin')
def make_admin_page():
    if not g.user or isinstance(g.user,Patient) or not g.user.is_admin:
        return redirect('/register')

    if isinstance(g.user,Healthcare_Professionals):
        all_non_admin_hcps = Healthcare_Professionals.query.filter_by(is_admin = False,institution_id = g.user.institution_id).all()
    else:
        all_non_admin_hcps = Healthcare_Professionals.query.filter_by(is_admin = False).all()

    return render_template('make_admin_page.html',hcps = all_non_admin_hcps)


@admin_bp.route('/make_admin',methods=["POST"])
def make_admin():
    if not g.user or isinstance(g.user,Patient) or not g.user.is_admin:
        return redirect('/register')

    req = request.get_json()
    username = req.get("username")

    Admin.make_admin(username)

    res = make_response(jsonify({'message': f'The user {username} has been given admin privlages.'}),200)        

    return res


@admin_bp.route('/add_institution',methods=["GET","POST"])
def add_institution():
    if not g.user or isinstance(g.user,Patient) or not g.user.is_admin:
        return redirect('/register')

    form = AddInstitutionForm()

    if form.validate_on_submit():
        name = form.name.data
        address = form.address.data

        Institution.add_Institution(name,address)

        return redirect(f'users/{g.user.username}')

    return render_template('add_institution.html',form=form)


@admin_bp.route('/delete_institution')
def delete_institution_page():
    if not g.user or isinstance(g.user,Patient) or not g.user.is_admin:
        return redirect('/register')

    all_institutions = Institution.query.all()

    return render_template('delete_institutions.html', institutions = all_institutions)

@admin_bp.route('/delete_institution',methods=["POST"])
def delete_institution():
    if not g.user or isinstance(g.user,Patient) or not g.user.is_admin:
        return redirect('/register')

    req = request.get_json()
    id = req.get("username")

    Institution.delete_Institution(id)

    res = make_response(jsonify({'message': f'The institution was deleted successfully.'}),200)        

    return res


@admin_bp.route('/delete_users')
def delete_users():
    if not g.user or isinstance(g.user,Patient) or not g.user.is_admin:
        return redirect('/register')

    if isinstance(g.user,Healthcare_Professionals):
        all_hcps = Healthcare_Professionals.query.filter_by(institution_id = g.user.institution_id).all()
        return render_template('delete_users.html',hcps = all_hcps)

    else:
        all_hcps = Healthcare_Professionals.query.all()
        all_patients = Patient.query.all()
        return render_template('delete_users.html',hcps = all_hcps,patients=all_patients)


@admin_bp.route('/delete_users',methods=["POST"])
def delete_user_by_username():
    if not g.user or isinstance(g.user,Patient) or not g.user.is_admin:
        return redirect('/register')

    req = request.get_json()
    username = req.get("username")
    type = req.get("type")
    Admin.delete_user_by_username(username,type)

    res = make_response(jsonify({'message': f'The user {username} was deleted successfully.'}),200)        

    return res
