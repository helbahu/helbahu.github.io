function digitCount (num){
    if(num%1 !== 0)return 0;
    return `${Math.abs(num)}`.length;
}
function mostDigits (arr){
    if(arr.length === 0) return 0;
    return Math.max(digitCount(Math.max(...arr)),digitCount(Math.min(...arr)))
}


function getDigit (num,digitIdxFromEnd,additionalDigit=0){
    let numStr = `${Math.abs(num)}`;
    let digit = +numStr[numStr.length-1-digitIdxFromEnd];
    return digit || additionalDigit;
}

function radixSort(arr) {
    // maxDigits will look for the largest absolute number and determine the number of digits in that number.
    let maxDigits = mostDigits(arr);
    // this will increase after each iteration to check the digit at the position from the end.
    let digitIdxFromEnd = 0;

    // buckets and negativeBuckets are used to store the numbers based on which digit they contian from 0 - 9. Also, the key -1 is used
    // to store all numbers that have undefined as their digit, meaning that they are smaller than the other numbers.
    let buckets = {};
    let negativeBuckets = {};

    // putInBucket is a function that takes a number and puts it in the appropriate bucket.
    const putIntoBucket = (num) => {
        let negative = num < 0;
        let digit = getDigit(num,digitIdxFromEnd);

        if(negative){
            if(digit){
                negativeBuckets[digit] ? negativeBuckets[digit].push(Math.abs(num)) : negativeBuckets[digit] = [Math.abs(num)];
            }else{negativeBuckets
                negativeBuckets[-1] ? negativeBuckets[-1].push(Math.abs(num)) : negativeBuckets[-1] = [Math.abs(num)];
            }

        }else{
            if(digit){
                buckets[digit] ? buckets[digit].push(num) : buckets[digit] = [num];
            }else{
                buckets[-1] ? buckets[-1].push(num) : buckets[-1] = [num];            
            }    
    
        }

    }

    // while maxDigits is greater than or equal to digitIdFromEnd, the loop will continue. 
    while(maxDigits >= digitIdxFromEnd){
        // for every number in the array, it will put each number in the appropriate bucket.
        for(let num of arr){
            putIntoBucket(num);
        }
        // this will be the output bucket, it will update arr.
        let updatedArr = [];

        // for every key in the negativeBuckets, it will push the values to the updatedArr in the appropriate order.
        for(let i = 9;i >= -1;i--){
            if(negativeBuckets[i]){
                for(let j = negativeBuckets[i].length -1;j >= 0;j--){
                    updatedArr.push(-1*negativeBuckets[i][j]);
                }
            }
        }

        // for every key in the buckets, it will push the values to the updatedArr in the appropriate order.
        for(let i = -1;i <= 9;i++){
            if(buckets[i]){
                for(const val of buckets[i]){
                    updatedArr.push(val);
                }
            }
        }

        arr = updatedArr;
        negativeBuckets = {};
        buckets = {};
        digitIdxFromEnd++;
    }

    return arr;

}

module.exports = { getDigit, digitCount, mostDigits, radixSort };