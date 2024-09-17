function insertionSort(arr) {
    const insert = (i,val,valIdx) => {
        for(let j = i-1;j >= 0;j--){
            if(val < arr[j]){
                arr[valIdx] = arr[j];
                arr[j] = val;
                valIdx = j;
            }else{
                break;
            }
        }
        
    }
    
    for(let i = 0;i < arr.length;i++){
        let val = arr[i];
        let valIdx = i;
        insert(i,val,valIdx);

    }

    return arr;
    
}
    
module.exports = insertionSort;