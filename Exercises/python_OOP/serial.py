"""Python serial number generator."""

class SerialGenerator:
    """Machine to create unique incrementing serial numbers.
    
    >>> serial = SerialGenerator(start=100)

    >>> serial.generate()
    100

    >>> serial.generate()
    101

    >>> serial.generate()
    102

    >>> serial.reset()

    >>> serial.generate()
    100
    """
    def __init__(self, start):
        self.start = start
        self.num = start

    def generate(self):
        "generate() will return the next number in sequence starting from the start value"
        n = self.num
        self.num += 1
        return n        
    def reset(self):
        "resets the number generated to the initial value"
        self.num = self.start 