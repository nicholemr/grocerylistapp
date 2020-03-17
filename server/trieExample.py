import csv


class TrieNode():
    ''' Create Trie node to be used in trie '''

    def __init__(self, value):
        self.value = value
        self.children = []
        self.words = []
        self.word = None


class Trie():
    ''' Create Trie with None root and letter nodes as children '''

    def __init__(self):
        self.root = TrieNode(None)

    def add_words(self, arr):
        ''' Adds each word in a list of words to the trie '''

        for word in arr:
            self.add_word(word)

    def add_word(self, word):
        ''' Adds a word to the trie '''

        traverse = self.root

        for letter in word:
            found = False
            for c in traverse.children:
                if c.value == letter:
                    traverse = c
                    traverse.words.append(word)
                    found = True
                    break

            if not found:
                n = TrieNode(letter)
                traverse.children.append(n)
                traverse = n
                traverse.words.append(word)

        traverse.word = word

    def search(self, word):
        ''' Returns True if word is in the trie, False otherwise '''

        traverse = self.root

        for letter in word:
            found = False
            for c in traverse.children:
                if c.value == letter:
                    traverse = c
                    found = True
                    break

            if not found:
                return False

        return (traverse.word is not None)

    def prefix_search(self, prefix):
        ''' Returns a sorted list of words starting with prefix '''

        traverse = self.root

        for letter in prefix:
            found = False
            for c in traverse.children:
                if c.value == letter:
                    traverse = c
                    found = True
                    break

            if not found:
                return None

        return sorted(traverse.words)


t = Trie()
t.add_words(keys)
