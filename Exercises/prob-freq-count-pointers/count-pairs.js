/*
    Given an array of integers, and a number, find the number of pairs of integers 
    in the array whose sum is equal to the second parameter. You can assume that 
    there will be no duplicate values in the array.

    Constraints:
        Time Complexity - O(N * log(N))
        OR
        Time Complexity - O(N)

*/

function countPairs(arr,sum) {
    let obj = {};
    let count = 0;

    for(let num of arr){
        if(obj[sum-num]){
            count ++;
        }        
        obj[num] = true;

    }
    return count;
}

module.exports = countPairs;