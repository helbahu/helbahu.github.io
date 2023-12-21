def print_upper_words(words,ltr_set):
    """
        Takes a list of words and a set of letters and prints each word that starts with any of the letters in the ltr_set.
        The words will be pritned fully capitalized.

    """
    for word in words:
        w = word.upper()
        lower_case = word.lower()
        if {lower_case[0]}.issubset(ltr_set):
            print(w)
        if {w[0]}.issubset(ltr_set):
            print(w)


print (print_upper_words(["Chocolate","cookies","Chicken","Bread","Ice Cream","Candy"],{"c","i"}))
