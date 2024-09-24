/*
    Write a function called isSubsequence which takes in two strings and checks whether 
    the characters in the first string form a subsequence of the characters in the 
    second string. In other words, the function should check whether the characters in 
    the first string appear somewhere in the second string, without their order 
    changing.

    Constraints: Time Complexity - O(N + M).
    NOTE: Although the constraint is O(N+M), this function is O(M).

*/

function isSubsequence(str1,str2) {
    let idx = 0;
    let ltr = str1[idx];

    for(let i = 0; i < str2.length; i++){
        if(ltr === str2[i]){
            idx++;
            ltr = str1[idx];
        }
        
    }
    if(str1.length === idx){
        return true;
    }
    return false;

}

module.exports = isSubsequence;