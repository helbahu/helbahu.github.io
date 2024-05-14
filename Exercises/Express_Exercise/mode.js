const mode = (arr) => {
    let numObj = {};
    for(let num of arr){
        numObj[num] ? numObj[num] ++ : numObj[num] = 1;
    }
    let values = Object.values(numObj);
    values.sort((a,b)=>a-b)
    let maxOccurence = values[values.length-1]
    let mode = [];
    for(let key in numObj){
        numObj[key] === maxOccurence ? mode.push(key) : null;
    }

    return mode;
}

module.exports = mode;