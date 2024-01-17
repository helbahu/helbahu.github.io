// Write a function called findRotationCount which accepts an array of distinct numbers sorted in increasing order. 
//The array has been rotated counter-clockwise n number of times. Given such an array, find the value of n.
function findRotationCount(rotArr) {
    let lMarker = 0;
    let rMarker = rotArr.length -1;
    while(lMarker <= rMarker){
      let midIdx = Math.floor((rMarker + lMarker)/2);
      let midVal = rotArr[midIdx];
  
      if(rotArr[midIdx-1] > midVal){
        return midIdx;  
      }
      if(midVal > rotArr[midIdx+1]){
        return midIdx + 1;  
      }

      if(rotArr[lMarker] > midVal){
        rMarker = midIdx - 1;
      }else if(midVal > rotArr[rMarker]){
        lMarker = midIdx + 1;
      }else{
        return 0;
      }
      
      
    }  
  
}

module.exports = findRotationCount