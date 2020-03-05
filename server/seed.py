from food_model import Food, connect_to_db, db
from server import app
import csv
from pprint import pprint


##############################################################################
def load_food_gwp():
    food_records = {}

    # delete all rows in foods table to avoid duplicating data when running this function
    Food.query.delete()
    with open('seed_data/foodco2.csv', newline='') as csvfile:
        fndds = csv.reader(csvfile, delimiter=',')
        count = 0
        for row in fndds:
            # print(row)
            if count > 0:
                row_str = ', '.join(row)
                row_str_fields = row_str.split(',')
                # food_records[]={'GWP':}

                foodid = row_str_fields[0].title()
                gwp_val = float(row_str_fields[-1])
                food_records[foodid] = gwp_val
            count += 1

        for foodid, gwp in food_records.items():
            food_obj = Food(food_id=foodid, gwp=gwp)
            db.session.add(food_obj)
    pprint(food_records)

    db.session.commit()


if __name__ == "__main__":

    connect_to_db(app)
    db.create_all()
    load_food_gwp()
