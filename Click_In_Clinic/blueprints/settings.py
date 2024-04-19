from flask import Blueprint, render_template,redirect,session,g
from forms import SettingsForm

settings_bp = Blueprint('settings',__name__,template_folder='/templates')


# SETTINGS PAGE ------------------------------------------------------------------------------------------------------------PART07
@settings_bp.route('/settings',methods=["GET","POST"])
def settings():
    if not g.user:
        return redirect('/register')

    form = SettingsForm()
    if form.validate_on_submit():
        theme = form.theme.data

        session['theme'] = theme
        return redirect(f'users/{g.user.username}')

    return render_template('settings.html',form=form)
