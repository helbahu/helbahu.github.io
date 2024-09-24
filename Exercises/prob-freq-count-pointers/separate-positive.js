/*
    Write a function called separatePositive which accepts an array of 
    non-zero integers. Separate the positive integers to the left and 
    the negative integers to the right. The positive numbers and 
    negative numbers need not be in sorted order. The problem should 
    be done in place (in other words, do not build a copy of the 
    input array).

    Constraints: Time Complexity: O(N)

*/

function separatePositive(arr) {
    let leftPointer = 0;
    let rightPointer = arr.length -1;

    while(leftPointer < rightPointer){
        if(arr[leftPointer] < 0 && arr[rightPointer] > 0){
            let temp = arr[leftPointer];
            arr[leftPointer] = arr[rightPointer];
            arr[rightPointer] = temp;
        }
        if(arr[leftPointer] > 0) leftPointer++;
        if(arr[rightPointer] < 0) rightPointer--;
    }

    return arr;
}

module.exports = separatePositive;