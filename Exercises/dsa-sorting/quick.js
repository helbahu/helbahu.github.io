/*
pivot accepts an array, starting index, and ending index
You can assume the pivot is always the first element
*/

function pivot(arr,startIdx,endIdx){
    // choose the leftmost element as pivotIdx
    let pivotIdx = startIdx;
    let pivotLarge;

    let doneLooping = false;

    while(!doneLooping){
        for(let i = startIdx + 1;i<= endIdx;i++){
            if(pivotLarge === undefined && arr[i] > arr[pivotIdx]){
                pivotLarge = i;
            }
            if(pivotLarge && arr[i] <= arr[pivotIdx] && i > pivotLarge){
                let temp = arr[i];
                arr[i] = arr[pivotLarge];
                arr[pivotLarge] = temp;
                pivotLarge = undefined;
                break;
            }
            if(i === endIdx){
                doneLooping = true;
                if(!pivotLarge) pivotLarge = endIdx + 1;
                if(pivotLarge > 1){
                    let temp = arr[pivotIdx];
                    arr[pivotIdx] = arr[pivotLarge-1];
                    arr[pivotLarge-1] = temp;
                    pivotIdx = pivotLarge - 1;
                }
                
            }

        }  
        
    }

    return pivotIdx;
}

/*
quickSort accepts an array, left index, and right index
*/

function quickSort(arr,leftIdx,rightIdx) {
    if (leftIdx < rightIdx){
        let pivotIndex = pivot(arr,leftIdx, rightIdx);
        quickSort(arr, leftIdx, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, rightIdx);
    }

    return arr;
}

module.exports = {pivot,quickSort};