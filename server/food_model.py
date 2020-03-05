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

    def calc_item_total_co2(self, qty):
        qty = float(qty)
        return round(qty * self.gwp, 2)

    def __repr__(self):
        """show info about a Food instance"""
        return f'<Food = {self.food_id}>'


class Food_record(db.Model):
    __tablename__ = "food_records"

    item_id = db.Column(db.Integer, primary_key=True, autoincrement=True,)
    food_id = db.Column(db.String(100),
                        db.ForeignKey('foods.food_id'), nullable=False,)
    qty = db.Column(db.Float, nullable=False,)
    record_id = db.Column(db.Integer,
                          db.ForeignKey('records.record_id'), nullable=False)
    checked = db.Column(db.Boolean, nullable=False)

    food = db.relationship("Food",
                           backref=db.backref("food_records"))

    record = db.relationship("Record",
                             backref=db.backref("food_records"))

    def update_qty(self, qty):
        qty = float(qty)
        self.qty = qty

    def calc_item_total_co2(self, qty):
        qty = float(qty)
        return round(qty * self.food.gwp, 2)

    def __repr__(self):
        """show info about a List_item instance"""
        return f'<Food_record record_id={self.record_id} food ={self.food_id}>'


class Record(db.Model):
    __tablename__ = "records"

    record_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer,
                        db.ForeignKey('users.user_id'), nullable=False)
    date_created = db.Column(db.DateTime(
        timezone=True))
    total_co2 = db.Column(db.Float, nullable=False,)

    user = db.relationship("User",
                           backref=db.backref("records"))

    def update_total_co2(self, item_co2):
        item_co2 = float(item_co2)
        self.total_co2 = round(self.total_co2 + item_co2, 2)

    def get_all_foods_in_record(self):

        food_records = {}

        for food_record in self.food_records:
            food_records[food_record.item_id] = {
                'food_id': food_record.food_id,
                'qty': food_record.qty,
                'co2_output': food_record.calc_item_total_co2(food_record.qty)
            }

        return food_records

    def copy_from_last_record(self):

        past_records = Record.query.filter(
            Record.user_id == self.user_id).all()

        if len(past_records) > 1:

            max_num = 0
            past_record = None
            for record in past_records:
                if record.record_id == self.record_id:
                    continue
                elif int(record.record_id) > max_num:
                    past_record = record
                    max_num = int(record.record_id)

            for food in past_record.food_records:
                copy_food = Food_record(
                    food_id=food.food_id, qty=food.qty, record=self, checked=food.checked)
                food_co2 = food.calc_item_total_co2(food.qty)
                self.update_total_co2(food_co2)
                db.session.add(copy_food)
                db.session.commit()

    def __repr__(self):
        """show info about a Record instance"""
        return f'<Record ID = {self.record_id}>'


class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        """show info about a User instance"""
        return f'<User id = {self.user_id}>'

    def check_user(self, username, password):
        user = User.query.filter(
            User.username == username, User.password == password).first()
        if user:
            return user
        else:
            return False


if __name__ == "__main__":
    from server import app
    connect_to_db(app)
    db.create_all()

    # db.session.commit()
