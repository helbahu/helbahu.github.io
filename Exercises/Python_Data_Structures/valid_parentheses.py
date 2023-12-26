def valid_parentheses(parens):
    """Are the parentheses validly balanced?

        >>> valid_parentheses("()")
        True

        >>> valid_parentheses("()()")
        True

        >>> valid_parentheses("(()())")
        True

        >>> valid_parentheses(")()")
        False

        >>> valid_parentheses("())")
        False

        >>> valid_parentheses("((())")
        False

        >>> valid_parentheses(")()(")
        False
    """
    test_value = 0
    for p in parens:
        if p == "(":
            test_value += 1
        elif p == ")":
            test_value -= 1
        if test_value < 0:
            return False
    if test_value != 0:
        return False
    return True