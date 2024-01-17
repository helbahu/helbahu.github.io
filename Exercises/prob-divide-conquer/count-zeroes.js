// Given an array of 1s and 0s which has all 1s first followed by all 0s, write a function called countZeroes, which returns the number of zeroes in the array.
function countZeroes(arr) {
  let lMarker = 0;
  let rMarker = arr.length -1
  while(lMarker <= rMarker){
    let midIdx = Math.floor((rMarker + lMarker)/2);
    let midVal = arr[midIdx];

    if(midVal === 0){
        if(arr[midIdx-1] === 1){
            return arr.length - midIdx;
        }

        rMarker = midIdx - 1; 
    }
    
    if(midVal === 1){
        if(arr[midIdx+1] === 0){
            return arr.length - (midIdx+1);
        }
    
        lMarker = midIdx + 1; 
    }

  }

  if(arr[0] === 0){
    return arr.length;
  }else{
    return 0;
  }

}

module.exports = countZeroes