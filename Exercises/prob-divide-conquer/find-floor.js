// Write a function called findFloor which accepts a sorted array and a value x, and returns the floor of x in the array. 
//The floor of x in an array is the largest element in the array which is smaller than or equal to x. If the floor does not exist, return -1.
function findFloor(sortedArr,x) {
    // Checks if the arrays first value is greater than our x
    if(sortedArr[0] > x){
        return -1;
    }
    
    let lMarker = 0;
    let rMarker = sortedArr.length -1;
    let lowerIdx = 0;    
    while(lMarker <= rMarker){
        let midIdx = Math.floor((rMarker + lMarker)/2);
        let midVal = sortedArr[midIdx];

        if(midVal <= x){
            if(sortedArr[midIdx+1] > x){
                return midVal;
            }else{
                lMarker = midIdx + 1; 
            }
        }else{
            rMarker = midIdx -1;
        }
    
    }
    return sortedArr[sortedArr.length-1];

}

module.exports = findFloor