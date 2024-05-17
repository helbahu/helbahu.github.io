"""Produce new square adding two inputs squares.

Two simple squares can be added::

    >>> s1 = 0
    >>> s2 = 1

    >>> add(s1, s2)
    1

A simple square and a split square can be added::

    >>> s1 = 0
    >>> s2 = [1, 0, 1, 0]

    >>> add(s1, s2)
    [1, 0, 1, 0]

Two split squares can be added::

    >>> s1 = [0, 0, 0, 1]
    >>> s2 = [0, 1, 0, 1]

    >>> add(s1, s2)
    [0, 1, 0, 1]

Nested squares can be added::

    >>> s1 = [0, [1, 1, 1, [0, 0, 0, 0]], [0, 0, 0, 0], 1]
    >>> s2 = [1, [1, 0, 1, [0, 0, 1, 1]], [1, 0, 1, 0], 1]

    >>> add(s1, s2)
    [1, [1, 1, 1, [0, 0, 1, 1]], [1, 0, 1, 0], 1]

Unevenly-nested squares can be added::

    >>> s1 = [0, [1, 1, 1, 0           ], [0, 0, 0, 0], 1]
    >>> s2 = [1, [1, 0, 1, [0, 0, 1, 1]], [1, 0, 1, 0], 1]

    >>> add(s1, s2)
    [1, [1, 1, 1, [0, 0, 1, 1]], [1, 0, 1, 0], 1]

    >>> s1 = [0, [1, 1, 1, 1                      ], [0, 0, 0, 0], 1]
    >>> s2 = [1, [1, 0, 1, [0, [0, 0, 0, 0], 1, 1]], [1, 0, 1, 0], 1]

    >>> add(s1, s2)
    [1, [1, 1, 1, [1, [1, 1, 1, 1], 1, 1]], [1, 0, 1, 0], 1]
"""

def fillList(lst):
    if len(lst) == 0:
        return []
    if isinstance(lst[0],int):
        return [1,*fillList(lst[1:])]
    else:
        return [fillList(lst[0]),*fillList(lst[1:])]

def add(s1, s2):
    """Produce new split square adding two input squares."""
    if isinstance(s1,int) and isinstance(s2,int):
        return s1 if s1 == 1 else s2
    elif isinstance(s1,int) and isinstance(s2,list):
        return s2 if s1 == 0 else fillList(s2)
    elif isinstance(s2,int) and isinstance(s1,list):
        return s1 if s2 == 0 else fillList(s1)
    elif isinstance(s1,list) and isinstance(s2,list):
        if len(s1) == 0: 
            return []
        return [add(s1[0],s2[0]),*add(s1[1:],s2[1:])]

if __name__ == "__main__":
    import doctest
    if doctest.testmod().failed == 0:
        print ("\n*** ALL TESTS PASS; YOU MADE THAT SEEM SIMPLE!!\n")
