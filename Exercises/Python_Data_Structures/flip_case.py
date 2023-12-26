def flip_case(phrase, to_swap):
    """Flip [to_swap] case each time it appears in phrase.

        >>> flip_case('Aaaahhh', 'a')
        'aAAAhhh'

        >>> flip_case('Aaaahhh', 'A')
        'aAAAhhh'

        >>> flip_case('Aaaahhh', 'h')
        'AaaaHHH'

    """
    phrase_lst = list(phrase)
    phrase_lst = [ltr.swapcase() if ltr.lower() == to_swap.lower() else ltr for ltr in phrase_lst]
    string= ""
    for ltr in phrase_lst:
        string += ltr  
    return string   
