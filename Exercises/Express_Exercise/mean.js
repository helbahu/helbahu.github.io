const mean = (arr) => {
    let sum = 0;
    for(let num of arr){
        sum += parseFloat(num);
    }
    return sum/arr.length;
}

module.exports = mean;