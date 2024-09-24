/*
Write a function called "averagePair". Given a sorted array of integers and a target average, 
determine if there is a pair of values in the array where the average of the pair equals the 
target average. There may be more than one pair that matches the average target.

Constraints: Time Complexity: O(N)

*/

function averagePair(array,avg) {
    // The function will start with the first and last index of the array. In a while loop it
    // will calculate the average and check if it is equal to the given average (avg).
    // If current avg is equal lto the given avg, it will return true.
    // If current avg is less than given avg, it will increase the left index and if current
    // avg is greater than given avg, it will decrease the right index.
    // If no pair averaged to the given avg, it will return false;

    let left = 0;
    let right = array.length -1;

    while(left < right){
        let currentAvg = (array[left] + array[right])/2;
        if(currentAvg === avg){
            return true;
        }else if(currentAvg > avg){
            right--;
        }else if(currentAvg < avg){
            left++;
        }
        
    }

    return false;
}
module.exports = averagePair;