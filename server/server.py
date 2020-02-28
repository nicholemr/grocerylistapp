from flask import Flask, jsonify, render_template, redirect, request, session, flash, Response
from food_model import db, connect_to_db, Food, Food_record, Record, User
from datetime import datetime
import pytz
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = 'SOMEKEY'
CORS(app, supports_credentials=True)


@app.route('/')
def homepage():
    print("homepage")

    foods = Food.query.all()
    foods_list = []
    for food in foods:
        foods_list.append(food.food_id)

    if session.get('username'):
        user = User.query.filter(User.username == session['username']).first()

    return jsonify({'foods': foods_list})


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
    food_id = request.get_json()['foodId'].capitalize()
    qty = request.get_json()['foodQty']
    check_food_obj = Food.query.filter(
        Food.food_id.like(f'%{food_id}%')).first()

    # if session.get('record_id') or session.get('total_co2'):
    if check_food_obj:
        # if user input matched a food_id instance in Foods
        record_id = session['record_id']
        food_id = check_food_obj.food_id
        item_co2 = round(check_food_obj.gwp * int(qty), 2)

        session['total_co2'] = round(session['total_co2'] + item_co2, 2)
        totalco2 = session['total_co2']

        record = Record.query.get(record_id)
        record.update_total_co2(round(totalco2, 2))

        food_record = Food_record(
            food_id=food_id, qty=qty, record=record)

        db.session.add(food_record)
        db.session.commit()

        food_records = {}
        food_record_objs = Food_record.query.filter(
            Food_record.record == record).all()

        for food_record in food_record_objs:
            food_records[food_record.item_id] = {
                # 'item_id': food_record.item_id,
                'food_id': food_record.food_id,
                'qty': food_record.qty,
                'co2_output': round(food_record.qty*food_record.food.gwp, 2)
            }

        return jsonify({'food_records': food_records, 'total_co2': totalco2})
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

    sf_tz = pytz.timezone('US/Pacific')
    date = datetime.now(sf_tz).strftime("%d %b %y, %H:%M:%S")
    username = session['username']
    user_id = User.query.filter(User.username == username).first().user_id

    initial_co2 = 0

    record_obj = Record(
        user_id=user_id, date_created=date, total_co2=initial_co2)
    db.session.add(record_obj)
    db.session.commit()

    record_id = record_obj.record_id
    session['record_id'] = record_id
    session['total_co2'] = initial_co2

    print(f'new recordid created, {record_id}')

    return jsonify({'recordid': record_id})


@app.route('/user-records')
def user_records():

    user_obj = User.query.filter(
        User.username == session['username']).first()

    user_records_list = []
    record_number = 1
    for record in user_obj.records:
        user_records_list.append(
            [record_number, record.record_id, record.date_created, record.total_co2])
        record_number += 1
    print(user_records_list)
    return jsonify({"login": True, "lists": user_records_list})


@app.route('/user-records/<int:record_id>')
def record_details(record_id):

    record = Record.query.get(record_id)
    record_totalco2 = record.total_co2
    print('record_totalco2', record_totalco2)

    food_item_objs = Food_record.query.filter(
        Food_record.record_id == record_id).all()

    food_records = {}
    food_record_objs = Food_record.query.filter(
        Food_record.record == record).all()

    for food_record in food_record_objs:
        food_records[food_record.item_id] = {
            # 'item_id': food_record.item_id,
            'food_id': food_record.food_id,
            'qty': food_record.qty,
            'co2_output': round(food_record.qty*food_record.food.gwp, 2)
        }
        # food_records.append({
        #     'item_id': food_record.item_id,
        #     'food_id': food_record.food_id,
        #     'qty': food_record.qty,
        #     'co2_output': round(food_record.qty*food_record.food.gwp, 2)})

    return jsonify({'food_records': food_records, 'total_co2': record_totalco2})

    # return render_template('record_details.html', all_items = all_items, record_id = record_id)


@app.route('/delete-food-record-id/<int:item_id>')
def delete_food_item_id(item_id):

    Food_record.query.filter(Food_record.item_id == item_id).delete()
    db.session.commit()

    return (jsonify({
        'message': f'so far so good! item_id to delete: {item_id}',
        'confirmDelete': True
    }))


if __name__ == "__main__":
    connect_to_db(app)
    app.run(port=5000, host="0.0.0.0", debug=True)
