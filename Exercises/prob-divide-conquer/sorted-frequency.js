// Given a sorted array and a number, write a function called sortedFrequency that counts the occurrences of the number in the array
function sortedFrequency(sortedArr,num) {

    // Checks if the arrays first value is greater than our num
    if((sortedArr[0] > num)||(sortedArr[sortedArr.length -1] < num)){
        return -1;
    }else if((sortedArr[0] === num)&&(sortedArr[sortedArr.length -1] === num)){
        return sortedArr.length;
    }

    let lMarker = 0;
    let rMarker = sortedArr.length -1;
    let lowerIdx = 0;    
    while(lMarker <= rMarker){
      let midIdx = Math.floor((rMarker + lMarker)/2);
      let midVal = sortedArr[midIdx];
  
      if(midVal < num){
        if(sortedArr[midIdx+1] === num){
            lowerIdx = midIdx + 1;
            lMarker = rMarker+1;
        }else{
            lMarker = midIdx + 1; 
        }
      }else{
        rMarker = midIdx -1
      }
      
    }

    lMarker = 0;
    rMarker = sortedArr.length -1;
    let upperIdx = sortedArr.length -1;
    while(lMarker <= rMarker){
        let midIdx = Math.floor((rMarker + lMarker)/2);
        let midVal = sortedArr[midIdx];
    
        if(midVal > num){
          if(sortedArr[midIdx-1] === num){
              upperIdx = midIdx - 1;
              lMarker = rMarker+1;
          }else{
              rMarker = midIdx - 1; 
          }
        }else{
            lMarker = midIdx+1
        }
          
    }

    let result = upperIdx - lowerIdx +1;
    if(result === sortedArr.length){
        return -1;
    }else{
        return result;  
    }

}

module.exports = sortedFrequency


