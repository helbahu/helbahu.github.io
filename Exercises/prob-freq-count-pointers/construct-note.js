/*
Write a function called "constructNote", which accepts two strings, a message and some letters. 
The function should return true if the message can be built with the letters that you are 
given; otherwise, it should return false.
Assume that there are only lowercase letters and no space or special characters in both the message 
and the letters.

Constraints: Time Complexity: O(M + N) - If M is the length of message and N is the length of 
letters

*/

function constructNote(message,letters) {
    //1. Make an object that has a key for each letter and the value is the number of times that 
    // letter shows ub in the letters string. 
    const lettersObj = {};
    for(let ltr of letters){
        let val = lettersObj[ltr];
        val ? lettersObj[ltr] = val + 1 : lettersObj[ltr] = 1;
    };

    //2. Iterate through the message. For each letter, it will get the value in that object and 
    // subtract 1 from the value. If the letter isn't a key in the letters object created in 
    // step 1, then it returns false, and if the value of the key in the object is <= 0, it will
    // return false. Otherwise it will return true. 
    for(let ltr of message){
        let val = lettersObj[ltr];
        if(val > 0){
            lettersObj[ltr] = val - 1;
        }else{
            return false;
        }

    };

    return true;

}
module.exports = constructNote;