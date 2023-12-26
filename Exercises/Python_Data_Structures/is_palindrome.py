def is_palindrome(phrase):
    """Is phrase a palindrome?

    Return True/False if phrase is a palindrome (same read backwards and
    forwards).

        >>> is_palindrome('tacocat')
        True

        >>> is_palindrome('noon')
        True

        >>> is_palindrome('robert')
        False

    Should ignore capitalization/spaces when deciding:

        >>> is_palindrome('taco cat')
        True

        >>> is_palindrome('Noon')
        True
    """
    phrase_tup = tuple(''.join(phrase.lower().split(' '))) 
    print(phrase_tup)
    num = int(len(phrase_tup)/2 if len(phrase_tup)%2 == 0 else (len(phrase_tup)-1)/2)  
    for n in range(num): 
        if phrase_tup[n] != phrase_tup[-1-n]:
            return False
    return True

