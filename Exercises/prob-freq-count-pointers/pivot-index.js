/*
    Write a function called pivotIndex which accepts an array of integers, 
    and returns the pivot index where the sum of the items to the left,
    equal to the sum of the items to the right. If there are more than one 
    valid pivot index, return the smallest value.

*/

function pivotIndex(arr) {
    let rightSum = arr.reduce((a, b) => a + b, 0);

    let leftSum = 0;
    let pivotIdx = -1;

    for (let i = 0; i < arr.length; i++) {
        rightSum -= arr[i];

        if (leftSum === rightSum) {
            pivotIdx = i;
            break;
        }
        leftSum += arr[i];
    }
    return pivotIdx;
  
}

module.exports = pivotIndex;