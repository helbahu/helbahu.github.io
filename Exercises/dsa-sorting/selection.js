function selectionSort(arr) {
    let lowestIdx = 0;

    while(lowestIdx < arr.length){
        let switchedThisIteration = false;

        let smallestVal = arr[lowestIdx];
        let smallestValIdx = lowestIdx;

        for(let i = lowestIdx + 1; i < arr.length;i++){
            if(arr[i] <= smallestVal){
                smallestVal = arr[i];
                smallestValIdx = i;
                switchedThisIteration = true;
            }
        }

        if(switchedThisIteration){
            let tempOldLower = arr[lowestIdx];
            arr[lowestIdx] = smallestVal;
            arr[smallestValIdx] = tempOldLower;    
        }
        
        lowestIdx++;
    }
    
    return arr;
}

module.exports = selectionSort;