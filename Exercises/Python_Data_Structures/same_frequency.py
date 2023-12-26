def same_frequency(num1, num2):
    """Do these nums have same frequencies of digits?
    
        >>> same_frequency(551122, 221515)
        True
        
        >>> same_frequency(321142, 3212215)
        False
        
        >>> same_frequency(1212, 2211)
        True
    """
    return {f"{n}": str(num1).count(n) for n in str(num1)}=={f"{n}": str(num2).count(n) for n in str(num2)}