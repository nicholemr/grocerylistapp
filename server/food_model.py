# from flask import Flask
from flask_sqlalchemy import SQLAlchemy


import csv
from pprint import pprint

##############################################################################
db = SQLAlchemy()

def connect_to_db(app):
    # Connect app with db

    app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql:///groceries" 
    app.config["SQLALCHEMY_ECHO"] = False 
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        
    # setting up .app attribute and passing in app
    db.app = app
    db.init_app(app)


class Food(db.Model):
    __tablename__ = "foods"
    
    food_id = db.Column(db.String(100), primary_key=True,)
    gwp = db.Column(db.Float, nullable=False,)

    def __repr__(self):
        """show info about a Food instance"""
        return f'<Food = {self.food_id}>'


class List_item(db.Model):
    __tablename__ = "list_items"
    
    item_id = db.Column(db.Integer,primary_key=True,autoincrement=True,)
    food_id = db.Column(db.String(100), 
                        db.ForeignKey('foods.food_id'), nullable=False,)
    qty = db.Column(db.Float, nullable=False,)
    record_id = db.Column(db.Integer,
                        db.ForeignKey('records.record_id'),nullable=True)

    food = db.relationship("Food",
                           backref=db.backref("list_items"))

    record = db.relationship("Record",
                            backref=db.backref("list_items"))

    def __repr__(self):
        """show info about a List_item instance"""
        return f'<List item_id={self.item_id} food ={self.food_id}>'


class Record(db.Model):
    __tablename__ = "records"
    
    record_id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    user_id = db.Column(db.Integer, 
                        db.ForeignKey('users.user_id'), nullable=False)
    date_created = db.Column(db.DateTime(), nullable=False)
    total_co2 = db.Column(db.Float, nullable=False,)

    user = db.relationship("User",
                        backref=db.backref("records"))

    def update_total_co2(self, co2):
        self.total_co2 = co2

    def __repr__(self):
        """show info about a Record instance"""
        return f'<Record ID = {self.record_id}>'


class User(db.Model):
    __tablename__ = "users"
    
    user_id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    username = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        """show info about a User instance"""
        return f'<User id = {self.user_id}>'

    def check_user(username,password):
        user = User.query.filter(User.username == username, User.password == password).first()
        if user:
            return user
        else:
            return False




if __name__ == "__main__":
    from server import app
    connect_to_db(app)
    db.create_all()  

    # db.session.commit()





