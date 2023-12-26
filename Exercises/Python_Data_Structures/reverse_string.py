def reverse_string(phrase):
    """Reverse string,

        >>> reverse_string('awesome')
        'emosewa'

        >>> reverse_string('sauce')
        'ecuas'
    """
    lst = list(phrase)
    lst.reverse()
    string_rev = ""
    for ltr in lst:
        string_rev += ltr  
    return string_rev   
