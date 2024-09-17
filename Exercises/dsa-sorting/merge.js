function merge(arr1,arr2) {
    let sortedArr = [];
    let pointer1 = 0;
    let pointer2 = 0;
    while(pointer1 < arr1.length && pointer2 < arr2.length){
        if(arr1[pointer1] < arr2[pointer2]){
            sortedArr.push(arr1[pointer1]);
            pointer1++;
        }else{
            sortedArr.push(arr2[pointer2]);
            pointer2++;
        }
        
    }
    while(pointer1 < arr1.length){
        sortedArr.push(arr1[pointer1]);
        pointer1++;
    }
    while(pointer2 < arr2.length){
        sortedArr.push(arr2[pointer2]);
        pointer2++;
    }

    return sortedArr;

}

function mergeSort(arr) {
    if(arr.length > 1){
        let medianIdx = Math.floor(arr.length/2);
        let leftArr = mergeSort(arr.slice(0,medianIdx));
        let rightArr = mergeSort(arr.slice(medianIdx));
        return merge(leftArr,rightArr);
    }else{
        return arr;
    }

}

module.exports = { merge, mergeSort};