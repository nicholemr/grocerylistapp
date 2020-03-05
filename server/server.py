from flask import Flask, jsonify, render_template, redirect, request, session, flash, Response
from food_model import db, connect_to_db, Food, Food_record, Record, User
from datetime import datetime
import pytz
from flask_cors import CORS
import trie

app = Flask(__name__)
app.secret_key = 'SOMEKEY'
CORS(app, supports_credentials=True)


# @app.route('/')
# def homepage():


# print("homepage")

#  foods = Food.query.all()
#   foods_list = []
#    for food in foods:
#         foods_list.append(food.food_id)

#     if session.get('username'):
#         user = User.query.filter(User.username == session['username']).first()

#     return jsonify({'foods': foods_list})


# @app.route('/register', methods=["GET"])
# def register_process():

#     if session.get('username'):
#         flash(
#             f"Hi {session['username']}, please logout before registering a new user")
#         return redirect("/")
#     return render_template('register_form.html')

@app.route('/register', methods=["POST"])
def register_process():
    """checks first if username and password are already in database,
    creates new user instance in database if none found"""

    username = request.get_json()['username']
    password = request.get_json()['password']
    user = User.query.filter(
        User.username == username, User.password == password).first()

    if user:
        session['username'] = user.username
        print(user.username)
        return jsonify({'logIn': True,
                        "message": f"{user.username} is already registered!",
                        "username": f"{user.username}"})
    else:
        new_user = User(username=username, password=password)

        db.session.add(new_user)
        db.session.commit()
        print(new_user.username)
        session['username'] = new_user.username
        return jsonify({'logIn': True,
                        "message": f'Welcome {new_user.username}!',
                        "username": f"{new_user.username}"})


@app.route('/login', methods=["GET"])
def log_in_form():
    """route confirms that user is logged-in in server, sends
    confirmation back to componentDidMount() on <LogIn />
    """

    if session.get('username'):
        print("GET session[username]: ", session['username'])
        loggeduser = session['username']
        return jsonify({'login': True,
                        "message": f"{loggeduser} is already logged in!",
                        "username": f"{loggeduser}"})
    else:
        print('GET reqst', 'no user in session')
        return jsonify({'login': False, 'message': 'Please Log In',
                        "username": None})


@app.route('/login', methods=['POST'])
def log_in_form_post():
    """log in user"""

    username = request.get_json()['username']
    password = request.get_json()['password']

    user = User.query.filter(
        User.username == username, User.password == password).first()

    if session.get('username'):
        # if user already in session
        print("session[username]: ", session['username'])
        loggeduser = session['username']
        return {'login': True, "message": f"{loggeduser} is already logged in!"}
    elif user:
        # if user is found in DB, create new log-in session
        session['username'] = user.username
        print("session[username]: ", session['username'])
        return jsonify({'login': True,
                        'message': f'{user.username} is logged in!'})
    else:
        return jsonify({'login': False,
                        'message': 'wrong username and/or password'})


@app.route('/logout')
def log_out():
    """log out user"""
    session.clear()
    print('logged out!')
    return jsonify({'message': "you've been successfully logged out",
                    'logIn': False})


@app.route('/add-food', methods=['POST'])
def get_food_post():
    """
    POST: add food items to grocery list
    """

    # request is POST if user is logged in and a new grocery lis/record is created
    food_id = request.get_json()['foodId'].title()
    qty = request.get_json()['foodQty']
    check_food_obj = Food.query.filter(
        Food.food_id.like(f'%{food_id}%')).first()

    # if session.get('record_id') or session.get('total_co2'):
    if check_food_obj:
        # if user input matched a food_id instance in Foods
        record_id = session['record_id']
        food_id = check_food_obj.food_id

        check_if_repeated = Food_record.query.filter(
            Food_record.food_id == check_food_obj.food_id,
            Food_record.record_id == record_id).all()

        if len(check_if_repeated) > 0:
            return jsonify({"message": f"{food_id} is already in the list"})
        else:

            # update total_co2 value in current record_id
            record = Record.query.get(record_id)
            # create new Food_record instance in food_records table
            food_record = Food_record(
                food_id=food_id, qty=qty, record=record, checked=False)

            # update total co2 attribute in corresponding record
            item_co2 = check_food_obj.calc_item_total_co2(qty)
            record.update_total_co2(item_co2)

            db.session.add(food_record)
            db.session.commit()

            session['total_co2'] = record.total_co2

            # create dictionary with all food_instances in current record
            food_records = record.get_all_foods_in_record()

            return jsonify({'food_records': food_records, 'total_co2': record.total_co2})
    else:
        return jsonify({"message": f"{food_id} not found"})


@app.route('/get-food', methods=["GET"])
def get_food():
    """if GET: queries food info from database"""
    # request is GET if user is logged in but did not create a new grocery list
    food_id = request.args.get('foodId').capitalize()
    qty = request.args.get('foodQty')
    check_food_obj = Food.query.filter(
        Food.food_id.like(f'%{food_id}%')).first()

    if check_food_obj:
        # if user input matched a food_id instance in Foods
        # and if a record id has been initiated
        food_id = check_food_obj.food_id
        item_co2 = round(check_food_obj.gwp * int(qty), 2)

        return jsonify({"food_id": food_id, "qty": qty, "item_co2": item_co2,
                        'message': 'need to create new list',
                        "found_foodid": True})
    else:
        return jsonify({"message": f"{food_id} not found"})


@app.route('/create-record', methods=['GET'])
def create_record():
    """if user is logged in, add list record into records table
    takes in total_co2 calculated, user_id, date_created
    """
    if session.get('record_id'):

        record_id = session['record_id']
        record_obj = Record.query.filter(
            Record.record_id == record_id).first()
        total_co2 = round(session['total_co2'], 2)
        return jsonify({'recordid': record_id,
                        'total_co2': total_co2})

    return jsonify({'recordid': False})


@app.route('/create-record', methods=['POST'])
def create_record_post():
    """if user is logged in, add list record into records table
    takes in total_co2 calculated, user_id, date_created
    """

    if session.get('record_id'):

        record_id = session['record_id']
        record_obj = Record.query.filter(
            Record.record_id == record_id).first()

    else:
        # initializing new record if none in session
        sf_tz = pytz.timezone('US/Pacific')
        date = datetime.now(sf_tz).strftime("%d %b %y, %H:%M:%S")
        username = session['username']
        user_id = User.query.filter(User.username == username).first().user_id

        record_obj = Record(
            user_id=user_id, date_created=date, total_co2=0)
        db.session.add(record_obj)
        db.session.commit()

        record_obj.copy_from_last_record()

        session['record_id'] = record_obj.record_id
        session['total_co2'] = 0

    return jsonify({'recordid': record_obj.record_id,
                    'total_co2': record_obj.total_co2})


@app.route('/user-records')
def user_records():

    user_obj = User.query.filter(
        User.username == session['username']).first()

    user_records_dict = {}

    for record in user_obj.records:
        user_records_dict[record.record_id] = {
            'date_created': record.date_created,
            'total_co2': record.total_co2}

    return jsonify({"login": True, "record_dict": user_records_dict})


@app.route('/user-records/<int:record_id>')
def record_details(record_id):

    record = Record.query.get(record_id)
    record_totalco2 = record.total_co2

    food_records = {}

    for food_record in record.food_records:
        food_records[food_record.item_id] = {
            'food_id': food_record.food_id,
            'qty': food_record.qty,
            'co2_output': food_record.calc_item_total_co2(food_record.qty),
            'foodCheck': food_record.checked
        }

    return jsonify({'food_records': food_records, 'total_co2': record_totalco2})


@app.route('/delete-food-record-id/<int:item_id>')
def delete_food_item_id(item_id):
    """deletes food_record instance from Food_records table"""

    # calculate total co2 of item (item_co2/kg * qty)
    food_record_obj = Food_record.query.filter(
        Food_record.item_id == item_id).first()

    foodid_co2 = food_record_obj.calc_item_total_co2(food_record_obj.qty)

    food_record_obj.record.update_total_co2(foodid_co2*-1)

    Food_record.query.filter(Food_record.item_id == item_id).delete()
    db.session.commit()

    session['total_co2'] = food_record_obj.record.total_co2

    food_records = food_record_obj.record.get_all_foods_in_record()

    return (jsonify({
        'message': f' Deleted {food_record_obj.food_id} from grocery list',
        'confirmDelete': True,
        'food_records': food_records,
        'total_co2': session['total_co2']
    }))


@app.route('/update-food-record-id/<int:item_id>')
def update_food_item_id(item_id):
    """modifies food_record instance quantity from Food_records table"""

    updated_qty = float(request.args.get('updatedQty'))

    # get food instance from db and modify qty attribute
    food_record = Food_record.query.get(item_id)
    prev_qty = food_record.qty
    food_record.update_qty(updated_qty)

    prev_item_co2 = food_record.calc_item_total_co2(prev_qty)
    new_item_co2 = food_record.calc_item_total_co2(updated_qty)

    # update total_co2 in session and in record
    food_record.record.update_total_co2(prev_item_co2*-1)
    food_record.record.update_total_co2(new_item_co2)
    db.session.commit()

    session['total_co2'] = food_record.record.total_co2
    total_co2 = session['total_co2']

    food_records = food_record.record.get_all_foods_in_record()

    return (jsonify({
        'message': f'updated {food_record.food_id} to {updated_qty} kgs. total co2 {total_co2} ',
        'confirmUpdate': True,
        'total_co2': total_co2,
        "food_records": food_records,
        'updated_item_co2': new_item_co2
    }))


@app.route('/delete-record-id/<int:record_id>')
def delete_record_id(record_id):
    """deletes record instance from Records table"""

    record_obj = Record.query.get(record_id)
    foods_in_record = record_obj.food_records

    print(foods_in_record)
    delete_food_records = Food_record.__table__.delete().where(
        Food_record.record_id == record_id)

    delete_records = Record.__table__.delete().where(
        Record.record_id == record_id)

    db.session.execute(delete_food_records)
    # db.session.commit()

    db.session.execute(delete_records)
    db.session.commit()

    return (jsonify({
        'message': f'record_id deleted: {record_id}',
        'confirmDelete': True,
    }))


@app.route('/update-food-boolean/<int:item_id>',  methods=["POST"])
def update_food_boolean(item_id):
    """modifies food_record instance boolean from Food_records table"""

    # checked_input = request.args.get('foodCheck')
    checked_input = request.get_json()['foodCheck']
    print(checked_input, type(checked_input))

    # get food instance from db and modify boolean attribute
    food_record = Food_record.query.get(item_id)

    food_record.checked = checked_input
    # update total_co2 in session and in record
    db.session.commit()

    return (jsonify({
        'confirmUpdate': True,
    }))


@app.route('/autocomplete')
def autocomplete():

    prefix = request.args.get('prefix')

    results = trie.food_trie.prefix_check(prefix.capitalize())
    print(results)
    return jsonify({'results': results})


if __name__ == "__main__":
    connect_to_db(app)
    app.run(port=5000, host="0.0.0.0", debug=True)
