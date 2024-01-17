function findLowestValIdx(rotArr){
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
// Write a function called findRotatedIndex which accepts a rotated array of sorted numbers and an integer. 
//The function should return the index of num in the array. If the value is not found, return -1.
function findRotatedIndex(rotArr,int) {
    let rotIdx = findLowestValIdx(rotArr);
    let lMarker;
    let rMarker;


    if((rotArr[rotIdx] > int)||(rotArr[rotIdx-1] < int)){
        return -1;
    }
    if((rotArr[rotIdx] <= int)&&(int <= rotArr[rotArr.length-1])){
        lMarker = rotIdx;
        rMarker = rotArr.length-1;
    }else{
        lMarker = 0;
        rMarker = rotIdx - 1;
    }

    while(lMarker <= rMarker){
        let midIdx = Math.floor((rMarker + lMarker)/2);
        let midVal = rotArr[midIdx];
    
        if(midVal === int){
            return midIdx;
        }
  
        if(midVal > int){
          rMarker = midIdx - 1;
        }else if(midVal < int){
          lMarker = midIdx + 1;
        } 

        
    }
    return -1;  

}

module.exports = findRotatedIndex