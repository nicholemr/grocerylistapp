from flask import Flask, jsonify, render_template, redirect, request, session, flash, Response
from food_model import db, connect_to_db, Food, List_item, Record, User
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
app.secret_key='SOMEKEY'
CORS(app)

@app.route('/')
def homepage():
    print("hello")
    
    foods = Food.query.all()
    foods_list = []
    for food in foods:
        foods_list.append(food.food_id)

    if session.get('username'):
        user = User.query.filter(User.username == session['username']).first()

    # ********* OG *********
    # return render_template('index.html', foods=foods)

    return jsonify({'foods' : foods_list})


@app.route('/register', methods=["GET", "POST"])    
def register_process():

    if request.method == 'GET':
        if session.get('username'):
            flash(f"Hi {session['username']}, please logout before registering a new user")
            return redirect("/") 
        return render_template('register_form.html')

    if request.method == 'POST':
        # ********* OG *********
        # username = request.form.get('username')
        # password = request.form.get('password')

        username = request.get_json()['username']
        password = request.get_json()['password']
        user = User.query.filter(User.username == username, User.password == password).first()
        
        if user:
            session['username'] = user.username
            flash(f'Hi {user.username}! you are already registered')
            return redirect('/')
        else:
            new_user = User(username=username,password=password)
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
            flash(f"Hi {session['username']}, you are already logged in!")
            return redirect("/") 
        else:
            return render_template('log-in.html')  
    
    elif request.method == 'POST':
        # ********* OG *********
        # username = request.form.get('username')
        # password = request.form.get('password')

        username = request.get_json()['username']
        password = request.get_json()['password']

        user = User.query.filter(User.username == username, User.password == password).first()

        if user:
            session['username'] = user.username
            # ********* OG *********
            # flash(f'Logged in! Hi {user.username}')
            # return redirect("/") 
            return jsonify({'username': user.username})
        else:
            # ********* OG *********
            # flash("Invalid Email and Password")
            # return redirect("/login")  
            return 'not found'
        # ********* OG *********
        # return redirect("/") 


@app.route('/logout')
def log_out():
    """log out user"""
    session.clear()
    return redirect("/")  


@app.route('/get-food', methods=["GET", 'POST'])
def get_food():
    """
    if GET: query food items and co2 values
    if POST: add food items to grocery list
    """
    # ********* OG *********
    # food = request.args.get('food')
    # qty = request.args.get('qty')
    food_id = request.get_json()['food'].capitalize()
    qty = request.get_json()['qty']
    check_food_obj = Food.query.filter(Food.food_id.like(f'%{food_id}%')).first()

    if request.method == 'GET':
        # check_food_obj that food_id is in Foods table
        if check_food_obj:
            # if user input matched a food_id instance in Foods
            # and if a record id has been initiated
            food = check_food_obj.food_id
            item_co2 = check_food_obj.gwp * int(qty)
            
            return jsonify({food: {"qty": qty, "item_co2" : item_co2}})
        else:
            return f'{food_id} not found in database'

    elif request.method == 'POST':
        
        if session.get('record_id') or session.get('total_co2'):
            if check_food_obj and session.get('record_id'):
                # if user input matched a food_id instance in Foods
                # and if a record id has been initiated
                
                food_id = check_food_obj.food_id
                record_id = session['record_id']
                item_co2 = check_food_obj.gwp * int(qty)
                session['total_co2'] = session['total_co2'] + item_co2
                totalco2 = session['total_co2']
                record = Record.query.get(record_id)
                record.update_total_co2(totalco2)

                list_item = List_item(food_id = food_id, qty = qty, record=record)
                db.session.add(list_item)
                db.session.commit()
                
                list_items = {}
                list_item_objs = List_item.query.filter(List_item.record == record).all()
                for item in list_item_objs:
                    list_items = {'food_id': item.food_id, 'qty': item.qty, 'co2 output': item.qty*item.food.gwp}
                return jsonify(list_items)
            else:
                return f'{food_id} not found in database'
        else:
            return 'need to create new record id on /create-list'


@app.route('/create-list')
def create_list():
    """if user is logged in, add list record into records table
    takes in total_co2 calculated, user_id, date_created
    """

    if session.get('username') :
        # if the user is logged in, create new grocery list Record
        date = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        username = session['username']
        user_id = User.query.filter(User.username == username).first().user_id

        if session.get('record_id'):
            
            record_id = session['record_id']
            record_obj = Record.query.filter(Record.record_id == record_id).first()
            # total_co2 = session['total_co2']
            # updated record_obj with new total_co2 value

        else:
            # if record_id not in session, create one and add it to session and records table
            initial_co2 = 0
            record_obj = Record(user_id=user_id, date_created=date, total_co2=initial_co2)
            db.session.add(record_obj)
            db.session.commit()
            session['record_id']=record_obj.record_id  
            session['total_co2'] = initial_co2
            
        list_items = List_item.query.filter(List_item.record_id==record_obj.record_id).all()

        return 'new list created, add items using /add-food'
        # return render_template('create_list.html', date=date, record_obj=record_obj, list_items=list_items, total_co2=session['total_co2'], username = session['username'])
    else:
        
        return redirect("/login")      


@app.route('/user-records')
def user_records():
    if session.get('username') :
        user_obj = User.query.filter(User.username == session['username']).first()
        user_records_dict = {}
        record_count = 1
        for record in user_obj.records:
            user_records_dict[record_count] = {'date_created': record.date_created, 'total_co2': record.total_co2}
            record_count+=1
        return jsonify(user_records_dict)
        # return render_template('user_records.html', user_obj=user_obj)
    else:
        flash("Please log in")
        return redirect("/login")  


@app.route('/user-records/<int:record_id>')
def record_details(record_id):
    record_id = record_id
    record = Record.query.get(record_id)
    list_item_objs = List_item.query.filter(List_item.record_id == record_id).all()
    list_items = {}
    list_item_objs = List_item.query.filter(List_item.record == record).all()
    item_count=1
    for item in list_item_objs:
        list_items[item_count] = {'food_id': item.food_id, 'qty': item.qty, 'co2 output': item.qty*item.food.gwp}
        item_count+=1
    return jsonify(list_items)
    
    # return render_template('record_details.html', all_items = all_items, record_id = record_id)

if __name__ == "__main__":
    connect_to_db(app)
    app.run(port=5000, host="0.0.0.0", debug=True)
