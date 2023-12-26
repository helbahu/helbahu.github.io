def find_factors(num):
    """Find factors of num, in increasing order.

    >>> find_factors(10)
    [1, 2, 5, 10]

    >>> find_factors(11)
    [1, 11]

    >>> find_factors(111)
    [1, 3, 37, 111]

    >>> find_factors(321421)
    [1, 293, 1097, 321421]
    """
    # instead of running through the whole range, we can run through half/third to reduce time by half/third
    return [*[i for i in range (1,num//2+1) if num%i == 0],num] if num%2 == 0 else [*[i for i in range (1,num//3+1) if num%i == 0],num]  
