/* 
    Write a function called sameFrequency. Given two positive integers, 
    find out if the two numbers have the same frequency of digits.

    Constraints: Time Complexity - O(N + M)

*/

function sameFrequency(int1,int2) {
    let int1Str = `${int1}`;
    let int2Str = `${int2}`;

    if(int1Str.length !== int2Str.length) return false;

    let obj = {};
    for(let digit of int1Str){
        obj[digit] ? obj[digit] = obj[digit] + 1 : obj[digit] = 1;
    }

    for(let digit of int2Str){
        if(obj[digit] > 0){
            obj[digit] = obj[digit] - 1;
        }else{
            return false;
        }
    };

    return true;
}

module.exports = sameFrequency;