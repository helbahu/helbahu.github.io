/*
    Write a function called twoArrayObject which accepts two arrays of varying lengths.
    The first array consists of keys and the second one consists of values. 
    Your function should return an object created from the keys and values. 
    If there are not enough values, the rest of keys should have a value of null. If there not enough keys, just ignore the rest of values.



*/
function twoArrayObject(keysArr,valsArr) {
    let obj = {};
    for(let i = 0; i<keysArr.length; i++){
        obj[keysArr[i]] = valsArr[i] || null;
    }

    return obj;
}

module.exports = twoArrayObject;