from flask import Flask, jsonify, render_template, redirect, request, session, flash, Response
from food_model import db, connect_to_db, Food, List_item, Record, User
from datetime import datetime
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


@app.route('/register', methods=["GET", "POST"])
def register_process():

    if request.method == 'GET':
        if session.get('username'):
            flash(
                f"Hi {session['username']}, please logout before registering a new user")
            return redirect("/")
        return render_template('register_form.html')

    if request.method == 'POST':
        # ********* OG *********
        # username = request.form.get('username')
        # password = request.form.get('password')

        username = request.get_json()['username']
        password = request.get_json()['password']
        user = User.query.filter(
            User.username == username, User.password == password).first()

        if user:
            session['username'] = user.username
            flash(f'Hi {user.username}! you are already registered')
            return redirect('/')
        else:
            new_user = User(username=username, password=password)
            db.session.add(new_user)
            db.session.commit()
            session['username'] = new_user.username
            flash(f'Welcome {new_user.username}!')

        return redirect('/')


@app.route('/login', methods=["GET", 'POST'])
def log_in_form():
    """log in user"""

    if request.method == 'GET':
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

    elif request.method == 'POST':

        username = request.get_json()['username']
        password = request.get_json()['password']

        user = User.query.filter(
            User.username == username, User.password == password).first()

        if session.get('username'):
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
            if session.get('username'):
                print(session['username'])
            return jsonify({'login': False,
                            'message': 'wrong username and/or password'})


@app.route('/logout')
def log_out():
    """log out user"""
    session.clear()
    print('logged out!')
    return redirect("http://localhost:8888")


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
                record.update_total_co2(totalco2)

                list_item = List_item(food_id=food_id, qty=qty, record=record)
                db.session.add(list_item)
                db.session.commit()

                list_items = []
                list_item_objs = List_item.query.filter(
                    List_item.record == record).all()
                # print(list_item_objs)
                for item in list_item_objs:
                    list_items.append({
                        'food_id': item.food_id, 'qty': item.qty, 'co2_output': item.qty*item.food.gwp})
                print(list_items)
                return jsonify(list_items)
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
        date = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
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
            record_obj = Record(
                user_id=user_id, date_created=date, total_co2=initial_co2)
            db.session.add(record_obj)
            db.session.commit()
            session['record_id'] = record_obj.record_id
            record_id = session['record_id']
            session['total_co2'] = initial_co2
            print(f'new recordid created, {record_id}')

        list_items = List_item.query.filter(
            List_item.record_id == record_obj.record_id).all()

        return jsonify({'recordid': record_id})
        # return render_template('create_list.html', date=date, record_obj=record_obj, list_items=list_items, total_co2=session['total_co2'], username = session['username'])
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
            user_records_dict.append([record.date_created, record.total_co2])
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
    list_item_objs = List_item.query.filter(
        List_item.record_id == record_id).all()
    list_items = {}
    list_item_objs = List_item.query.filter(List_item.record == record).all()
    item_count = 1
    for item in list_item_objs:
        list_items[item_count] = {
            'food_id': item.food_id, 'qty': item.qty, 'co2 output': item.qty*item.food.gwp}
        item_count += 1
    return jsonify(list_items)

    # return render_template('record_details.html', all_items = all_items, record_id = record_id)


if __name__ == "__main__":
    connect_to_db(app)
    app.run(port=5000, host="0.0.0.0", debug=True)
