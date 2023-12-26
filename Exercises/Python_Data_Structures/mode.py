def mode(nums):
    """Return most-common number in list.

    For this function, there will always be a single-most-common value;
    you do not need to worry about handling cases where more than one item
    occurs the same number of times.

        >>> mode([1, 2, 1])
        1

        >>> mode([2, 2, 3, 3, 2])
        2
    """
    mode = nums[0]
    mode_count = nums.count(nums[0])
    for num in nums:
        if nums.count(num) > mode_count:
            mode = num
            mode_count = nums.count(num)
    return mode


#Extra: This function returns 1 mode or a list of modes
def modes(nums):
    mode = {nums[0]}
    mode_count = nums.count(nums[0])
    for num in nums:
        if nums.count(num) > mode_count:
            mode = {num} 
            mode_count = nums.count(num)
        if nums.count(num) == mode_count:
            mode.add(num) 
    return mode

