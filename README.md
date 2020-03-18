# Carbon Food-Print

Carbon Food-Print is a grocery list carbon-footprint calculator, where the total emissions are translated into miles-driven by a standard economy car. Each grocery list item displays its percentage contribution to the list’s total carbon footprint. This gives the user a clear view of how production emissions for different food items compare. 

This is a single-page ReactJS application with a back-end stack of Python, PostgreSQL and Flask as the web framework.

Immediately after user log-in the user’s grocery list from a previous session is displayed, including any checkbox selections previously made. 

The app also provides search suggestions for the food items available in the database. 

## Tech Stack
- ReactJS
- Python
- JavaScript
- HTML
- CSS
- Flask
- PostgreSQL
- SQLAlchemy
- CSS Grid
- Flex-box
- React-Reveal
- React-Spring Animations


### Login

![log-in page](https://github.com/nicholemr/grocerylistapp/blob/master/READme/login.gif)

### Updating the Grocery List

![adding to list](https://github.com/nicholemr/grocerylistapp/blob/master/READme/addingItems.gif)

## Installation
```
$ git clone https://github.com/nicholemr/grocerylistapp.git
$ virtualenv env
$ source env/bin/activate
$ pip install -r requirements.txt
$ createdb groceries
$ python3 server/seed.py
```