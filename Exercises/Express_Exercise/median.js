const median = (arr) => {
    let arrCopy = arr.slice();
    let sortedArr = arrCopy.sort((a,b)=>a-b);

    let median;
    sortedArr.length % 2 === 0 ? median = (parseFloat(sortedArr[(sortedArr.length/2)-1]) + parseFloat(sortedArr[sortedArr.length/2]))/2 : median = sortedArr[Math.floor(sortedArr.length/2)]

    return median;
}

module.exports = median;