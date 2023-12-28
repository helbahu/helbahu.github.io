"""Word Finder: finds random words from a dictionary."""


class WordFinder:
    """
        Takes a file name/path and extracts words from the file making a list.

        
        NOTE: To run doctests type the following in the command line: python3 -m doctest -v wordfinder.py
        >>> words = WordFinder("testwords.txt")
        4 words read

        >>> words
        <WordFinder file: testwords.txt words: 4>

    """
    def __init__(self,file):
        self.file = file
        self.word_list = self.generate_word_list()
        self.word_list_length()

    def __repr__(self):
        return f"<WordFinder file: {self.file} words: {len(self.word_list)}>"

    def generate_word_list(self):
        """This function will make a list of words by looping over the file lines

            >>> words = WordFinder("testwords.txt")
            4 words read

            >>> words.generate_word_list()
            ['Apples', 'Bananas', '', 'Coconuts']

        """
        with open (self.file,"r") as f:
            return [word.strip() for word in f]
    def word_list_length(self):
        "Prints the length of the list generated from the source file"
        print(f"{len(self.word_list)} words read")
    def random(self,seed_num=None):
        """Returns a random word from word_list

            >>> words = WordFinder("words.txt")
            235886 words read

            >>> words.random(1)
            'cholepoietic'

            >>> words.random(25)
            'isolationist'
            
        """
        
        from random import randint, seed 
        if seed_num != None and isinstance(seed_num,int):
            "The seed will generate a predictable value for testing purposes"
            seed(seed_num)
        return self.word_list[randint(0,len(self.word_list))-1]


class SpecialWordFinder(WordFinder):
    """ Takes a file name/path and extracts words from the file making a list.
        Similar to WordFinder but it doesn't add any empty lines or #comments
        to the list. 

        NOTE: To run doctests type the following in the command line: python3 -m doctest -v wordfinder.py
        >>> words = SpecialWordFinder("testwords.txt")
        3 words read

        >>> words
        <SpecialWordFinder file: testwords.txt words: 3>

    """

    def __init__(self, file):
        super().__init__(file)

    def __repr__(self):
        return f"<SpecialWordFinder file: {self.file} words: {len(self.word_list)}>"

    def generate_word_list(self):
        """This function will make a list of words by looping over the file lines. It will ignore empty lines and python #comments
        
            >>> words = SpecialWordFinder("testwords.txt")
            3 words read

            >>> words.generate_word_list()
            ['Apples', 'Bananas', 'Coconuts']

        """
        with open (self.file,"r") as f:
            return [word.strip() for word in f if len(word.strip()) != 0 and word.strip()[0] != "#"]

