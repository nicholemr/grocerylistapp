import csv


class Node():

    def __init__(self, letter, children=None):
        self.letter = letter
        self.children = children or []
        self.words = []
        self.word = None
        # self.last = False

    def __repr__(self):
        return f'Node(): letter: {self.letter}'


class Foods_Trie():
    """create Trie with list of words from Foods database, each letter is a node"""

    def __init__(self):
        self.root = Node(None)

    def __repr__(self):
        return f'Foods_Trie(): root: {self.root}'

    def add_foods(self, foods_list):
        ''' Adds each food in a list of foods to the trie '''

        for food in foods_list:
            self.add_food(food)

    def add_food(self, food: str):
        """add nodes to self"""

        current = self.root
        # print(current.children)

        for letter in food:
            found = False
            for child in current.children:
                if child.letter == letter:
                    current = child
                    current.words.append(food)
                    found = True
                    break

            if not found:
                new_node = Node(letter)  #
                current.children.append(new_node)
                current = new_node
                current.words.append(food)

    def search_nodes(self, word):
        """returns a boolean if food is in the trie"""
        # searches for word in existing Trie
        # returns words that match the prefix
        current = self.root

        for letter in word:
            found = False
            for child in current.children:
                if child.letter == letter:
                    current = child
                    found = True
                    break

            if not found:
                return False
        return (current.word is not None)

    def prefix_check(self, prefix):
        # searches for word in existing Trie
        # returns words that match the prefix
        current = self.root

        for letter in prefix:
            found = False
            for child in current.children:
                if child.letter == letter:
                    current = child
                    found = True
                    break

            if not found:
                return None

        return sorted(current.words)


def create_food_keys_list():
    food_records = set()

    # delete all rows in foods table to avoid duplicating data when running this function
    with open('seed_data/foodco2.csv', newline='') as csvfile:
        fndds = csv.reader(csvfile, delimiter=',')
        count = 0
        for row in fndds:
            # print(row)
            if count > 0:

                row_str = ', '.join(row)

                row_str_fields = row_str.split(',')
                foodid = row_str_fields[0].title()
                food_records.add(foodid)

            count += 1

    return sorted(food_records)


keys = create_food_keys_list()

# print(keys)
food_trie = Foods_Trie()
food_trie.add_foods(keys)

# print(food_trie)
