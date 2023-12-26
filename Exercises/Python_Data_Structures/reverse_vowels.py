def reverse_vowels(s):
    """Reverse vowels in a string.

    Characters which are not vowels do not change position in string, but all
    vowels (y is not a vowel), should reverse their order.

    >>> reverse_vowels("Hello!")
    'Holle!'

    >>> reverse_vowels("Tomatoes")
    'Temotaos'

    >>> reverse_vowels("Reverse Vowels In A String")
    'RivArsI Vewols en e Streng'

    reverse_vowels("aeiou")
    'uoiea'

    reverse_vowels("why try, shy fly?")
    'why try, shy fly?''
    """
    vowel_list = [v for v in s if "aeiouAEIOU".find(v) > -1]
    reverse_vowels_string = ""
    for i in range(len(s)):
        if "aeiouAEIOU".find(s[i]) > -1:
            v = vowel_list.pop(-1)
            reverse_vowels_string += v
        else:
            reverse_vowels_string += s[i]
    return reverse_vowels_string
