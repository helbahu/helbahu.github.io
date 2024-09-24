/*
    Write a function called longestFall, which accepts an array 
    of integers, and returns the length of the longest 
    consecutive decrease of integers.
*/

function longestFall(arr) {
    let longestCount = 0;
    let count = 1;
    let lastNum;
    for(let num of arr){
        if(lastNum > num){
            count++;
        }else{
            count = 1;
        }
        lastNum = num;
        if(count > longestCount) longestCount = count;
    }
    return longestCount;
}

module.exports = longestFall;