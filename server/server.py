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
        return jsonify({'login': True,
                        "message": f"{user.username} is already registered!",
                        "username": f"{user.username}"})
    else:
        new_user = User(username=username, password=password)

        db.session.add(new_user)
        db.session.commit()
        print(new_user.username)
        session['username'] = new_user.username
        return jsonify({'login': True,
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
    return jsonify({'message': "you've been successfully logged out"})


@app.route('/get-food', methods=["GET", 'POST'])
def get_food():
    """
    if POST: add food items to grocery list
    if GET: queries food info from database
    """

    if request.method == 'POST':
        # request is POST if user is logged in and a new grocery lis/record is created
        food_id = request.get_json()['foodId'].capitalize()
        qty = request.get_json()['foodQty']
        check_food_obj = Food.query.filter(
            Food.food_id.like(f'%{food_id}%')).first()

        if session.get('record_id') or session.get('total_co2'):
            if check_food_obj:
                # if user input matched a food_id instance in Foods
                # and if a record id has been initiated

                food_id = check_food_obj.food_id
                record_id = session['record_id']
                item_co2 = check_food_obj.gwp * int(qty)
                session['total_co2'] = session['total_co2'] + item_co2
                totalco2 = session['total_co2']
                record = Record.query.get(record_id)
                record.update_total_co2(round(totalco2, 2))

                list_item = Food_record(
                    food_id=food_id, qty=qty, record=record)
                db.session.add(list_item)
                db.session.commit()

                food_records = []
                list_item_objs = Food_record.query.filter(
                    Food_record.record == record).all()
                # print(list_item_objs)
                for item in list_item_objs:
                    food_records.append({
                        'food_id': item.food_id, 'qty': item.qty, 'co2_output': round(item.qty*item.food.gwp, 2)})
                print(food_records)
                return jsonify(food_records)
            else:
                return jsonify({"message": f"{food_id} not found"})

    if request.method == 'GET':
        # request is GET if user is logged in but did not create a new grocery list
        food_id = request.args.get('foodId').capitalize()
        qty = request.args.get('foodQty')
        check_food_obj = Food.query.filter(
            Food.food_id.like(f'%{food_id}%')).first()

        if check_food_obj:
            # if user input matched a food_id instance in Foods
            # and if a record id has been initiated
            food_id = check_food_obj.food_id
            item_co2 = check_food_obj.gwp * int(qty)

            return jsonify({"food_id": food_id, "qty": qty, "item_co2": item_co2,
                            'message': 'need to create new list',
                            "found_foodid": True})
        else:
            return jsonify({"message": f"{food_id} not found"})


@app.route('/create-record')
def create_record():
    """if user is logged in, add list record into records table
    takes in total_co2 calculated, user_id, date_created
    """

    if session.get('username'):
        # if the user is logged in, create new grocery list Record
        sf_tz = pytz.timezone('US/Pacific')

        date = datetime.now(sf_tz).strftime("%d %b %y, %H:%M:%S")
        username = session['username']
        user_id = User.query.filter(User.username == username).first().user_id

        if session.get('record_id'):

            record_id = session['record_id']
            record_obj = Record.query.filter(
                Record.record_id == record_id).first()
            # total_co2 = session['total_co2']
            # updated record_obj with new total_co2 value
            print(f'recordid already in session, {record_id}')
        else:
            # if record_id not in session, create one and add it to session and records table
            initial_co2 = 0
            # record_obj = Record(
            #     user_id=user_id, total_co2=initial_co2)
            record_obj = Record(
                user_id=user_id, date_created=date, total_co2=initial_co2)
            db.session.add(record_obj)
            db.session.commit()
            session['record_id'] = record_obj.record_id
            record_id = session['record_id']
            session['total_co2'] = initial_co2
            print(f'new recordid created, {record_id}')

        food_records = Food_record.query.filter(
            Food_record.record_id == record_obj.record_id).all()

        return jsonify({'recordid': record_id})
        # return render_template('create_list.html', date=date, record_obj=record_obj, food_records=food_records, total_co2=session['total_co2'], username = session['username'])
    else:
        print('please log in')
        return jsonify({'message': 'please log in'})


@app.route('/user-records')
def user_records():
    if session.get('username'):
        user_obj = User.query.filter(
            User.username == session['username']).first()
        user_records_dict = []
        record_count = 1
        for record in user_obj.records:
            user_records_dict.append(
                [record.record_id, record.date_created, record.total_co2])
            # user_records_dict[record_count] = {
            #     'date_created': record.date_created, 'total_co2': record.total_co2}
            record_count += 1
        print(user_records_dict)
        return jsonify({"login": True, "lists": user_records_dict})
    else:
        print("not logged in")
        return jsonify({"login": False})


@app.route('/user-records/<int:record_id>')
def record_details(record_id):
    record_id = record_id
    record = Record.query.get(record_id)
    list_item_objs = Food_record.query.filter(
        Food_record.record_id == record_id).all()
    food_records = {}
    list_item_objs = Food_record.query.filter(
        Food_record.record == record).all()
    item_count = 1
    for item in list_item_objs:
        food_records[item_count] = {
            'food_id': item.food_id, 'qty': item.qty, 'co2 output': item.qty*item.food.gwp}
        item_count += 1
    return jsonify(food_records)

    # return render_template('record_details.html', all_items = all_items, record_id = record_id)


if __name__ == "__main__":
    connect_to_db(app)
    app.run(port=5000, host="0.0.0.0", debug=True)
