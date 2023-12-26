def sum_up_diagonals(matrix):
    """Given a matrix [square list of lists], return sum of diagonals.

    Sum of TL-to-BR diagonal along with BL-to-TR diagonal:

        >>> m1 = [
        ...     [1,   2],
        ...     [30, 40],
        ... ]
        >>> sum_up_diagonals(m1)
        73

        >>> m2 = [
        ...    [1, 2, 3],
        ...    [4, 5, 6],
        ...    [7, 8, 9],
        ... ]
        >>> sum_up_diagonals(m2)
        30
    """
    #This checks if the inputted matrix is valid, to avoid errors
    for m in matrix:
        if len(matrix) != len(m):
            return "Must be a Square Matrix"
    sum_TL_BR = 0
    sum_BL_TR = 0
    for n in range(len(matrix)):
        sum_TL_BR += matrix[n][n]
        sum_BL_TR += matrix[-1-n][n]
    print(sum_TL_BR,sum_BL_TR)
    return sum_TL_BR + sum_BL_TR
