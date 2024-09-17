function bubbleSort(arr) {

    // sortedIdxUpper keeps track of the index where sorting should end because values above are already sorted.
    let sortedIdxUpper = arr.length-1;

    // sortedIdxLower keeps track of the index where sorting should start because values below are already sorted.
    let sortedIdxLower = 0;

    // switchVal is a bool taht determines whether to use the forwardSort or backwardSort.
    let switchVal = true;
    
    // smallestUnsortedValIdx is the index having the smallest value (unsorted).
    let smallestUnsortedValIdx = 0;

    // largestUnsortedValIdx is the index having the largest value (unsorted).
    let largestUnsortedValIdx = arr.length-1;

    // switchSortDirection is a function that determines which sort function to use and changes the value of the bool variable switchVal.
    const switchSortDirection = () => {
        // avgUnsortedIdx is the average index between the lower and upper sorting indicies.
        let avgUnsotedIdx = Math.floor((sortedIdxUpper-sortedIdxLower)/2);

        // this conditional checks if the smallest value in each iteration is in the upper half of the array. In that case it will
        // allow the next loop to use the backwardSort function, as it is more efficient for this purpose.
        if(smallestUnsortedValIdx > avgUnsotedIdx){
            switchVal = false;
            smallestUnsortedValIdx = sortedIdxLower;
        }

        // this conditional checks if the largest value in each iteration is in the lower half of the array. In that case it will
        // allow the next loop to use the forwardSort function, as it is more efficient for this purpose.
        if(largestUnsortedValIdx < avgUnsotedIdx){
            switchVal = true;
            largestUnsortedValIdx = sortedIdxUpper;
        }

        // Note: an option could be to just switch between forwardSort and backwardSort for each iteration, but this is slightly more efficient.
        // switchVal = !switchVal;

    }
    
    // swappedInLastIteration is a bool that checks whether there was any swapping in the last iteration.
    let swappedInLastIteration = true;

    // forwardSort iterates through the array in the forward direction, it will cause large values to bubble up to the end of the array.
    const forwardSort = () => {
        // smallestVall keeps track of the smallest value in the iteration for the purposes of setting smallestUnsortedValIdx.
        let smallestVal = arr[sortedIdxLower];
        
        // lastSortIdx keeps track of the last index where sorting occured for the purposes of setting the sortedIdxUpper, so that
        // subsequent iterations won't iterate through those values unnecessarily.
        let lastSortIdx = 0;

        // swappedThisIteration will be set to true if any swap is made. This will set the swappedInLastIteration. If no swap was made
        // swappedInLastIteration will be set to false and the loop will end.
        let swappedThisIteration = false;

        // loops through the array from sortedIdxLower to sortedIdxUpper. 
        for(let i = sortedIdxLower; i < sortedIdxUpper;i++){
            const val = arr[i];
            
            // this conditional checks if the current value is greater than the next. If so, it will swap the values.
            if(val > arr[i+1]){
                // this conditional checks if the next value is smaller than smallestVal. If so it will set smallestVal to that value
                // and set smallestUnsortedValIdx to that index.
                if(arr[i+1] <= smallestVal){
                    smallestVal = arr[i+1];
                    smallestUnsortedValIdx = i+1;
                }

                arr[i] = arr[i+1];
                arr[i+1] = val;
                lastSortIdx = i;
                swappedThisIteration = true;
                
            }
        }
        sortedIdxUpper = lastSortIdx;        
        swappedInLastIteration = swappedThisIteration;
        
    }

    // backwardSort iterates through the array in the backward direction, it will cause small values to bubble to the start of the array.
    const backwardSort = () => {
        // largestVall keeps track of the largest value in the iteration for the purposes of setting largestUnsortedValIdx.
        let largestVal = arr[sortedIdxUpper];
        
        // lastSortIdx keeps track of the last index where sorting occured for the purposes of setting the sortedIdxLower, so that
        // subsequent iterations won't iterate through those values unnecessarily.
        let lastSortIdx = 0;

        // swappedThisIteration will be set to true if any swap is made. This will set the swappedInLastIteration. If no swap was made
        // swappedInLastIteration will be set to false and the loop will end.
        let swappedThisIteration = false;

        // loops through the array from sortedIdxUpper to sortedIdxLower. 
        for(let i = sortedIdxUpper; i > sortedIdxLower;i--){
            const val = arr[i];

            // this conditional checks if the current value is less than the next (next lower index). If so, it will swap the values.            
            if(val < arr[i-1]){
                // this conditional checks if the next (next lower index) value is larger than largestVal. If so it will set largestVal to that value
                // and set largestUnsortedValIdx to that index.
                if(arr[i-1] >= largestVal){
                    largestVal = arr[i-1];
                    largestUnsortedValIdx = i-1;
                }

                arr[i] = arr[i-1];
                arr[i-1] = val;
                lastSortIdx = i;
                swappedThisIteration = true;

            }
        }
        sortedIdxLower = lastSortIdx;
        swappedInLastIteration = swappedThisIteration;
        
    }

    // this while loop will continue unless one of the following conditions are met:
    // 1 - sortedIdxUpper is not greater than sortedIdxLower. This means that the lower end of the array and upper end of the array
    // have been sorted and met in the middle. 
    // 2 - swappedInLastIteration is false: This means that no swap was made and so the array was sorted.  
    while(sortedIdxUpper > sortedIdxLower && swappedInLastIteration){
        if(switchVal){
            forwardSort();
        }else{
            backwardSort();
        }
        switchSortDirection();
        
    }
    return arr;

}

module.exports = bubbleSort;