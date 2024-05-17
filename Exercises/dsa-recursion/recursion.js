/** product: calculate the product of an array of numbers. */

function product(nums) {
  if(nums.length === 0)return 1;
  return nums.pop() * product(nums);
}

/** longest: return the length of the longest word in an array of words. */

function longest(words) {
  if(words.length === 0)return 0;
  return Math.max(words.pop().length,longest(words));
}

/** everyOther: return a string with every other letter. */

function everyOther(str) {
  if(str.length === 0)return '';
  return str[0] + everyOther(str.slice(2));
}

/** isPalindrome: checks whether a string is a palindrome or not. */

function isPalindrome(str) {
  if(str.length <= 1)return true;
  return (str[0] === str[str.length-1]) && isPalindrome(str.slice(1,str.length-1))
}

/** findIndex: return the index of val in arr (or -1 if val is not present). */

function findIndex(arr, val) {
  const _findIndex = (arr,val) => {
    if(arr.length === 0)return 0;
    if(arr[0] === val){
      return 0;
    }else{
      return 1 + _findIndex(arr.slice(1),val);
    }  
  }
  let res = _findIndex(arr,val);
  return res === arr.length ? -1 : res;  
}

/** revString: return a copy of a string, but in reverse. */

function revString(str) {
  if(str === '')return '';
  return str[str.length-1] + revString(str.slice(0,str.length-1));
}

/** gatherStrings: given an object, return an array of all of the string values. */

function gatherStrings(obj) {
  const arr = Object.entries(obj);

  const _gatherStrings = (arr) =>{
    if(arr.length === 0)return [];

    if(arr[arr.length-1][1] instanceof Object){
      return [..._gatherStrings(Object.entries(arr.pop()[1])),..._gatherStrings(arr)];
    }
    if(typeof(arr[arr.length-1][1]) === 'string'){
      return [arr.pop()[1],..._gatherStrings(arr)];
    }else{
      arr.pop()
      return [..._gatherStrings(arr)];

    }

  }

  return _gatherStrings(arr);
}

/** binarySearch: given a sorted array of numbers, and a value,
 * return the index of that value (or -1 if val is not present). */

function binarySearch(arr, val) {
  const lIndex = 0;
  const rIndex = arr.length -1;
  const midIndex = Math.floor((rIndex+lIndex)/2);
  const midVal = arr[midIndex];

  const _binarySearch = (lIndex,rIndex,midIndex,midVal,_arr=arr,_val=val) => {
    if(lIndex > rIndex)return -1;
    if(midVal === _val)return midIndex;
    if(val < midVal){
      rIndex = midIndex-1;
      midIndex = Math.floor((rIndex+lIndex)/2);
      midVal = _arr[midIndex];
      return _binarySearch(lIndex,rIndex,midIndex,midVal);
    }else{
      lIndex = midIndex+1;
      midIndex = Math.floor((rIndex+lIndex)/2);
      midVal = arr[midIndex];
      return _binarySearch(lIndex,rIndex,midIndex,midVal);
    }
  }
  return _binarySearch(lIndex,rIndex,midIndex,midVal);
}

module.exports = {
  product,
  longest,
  everyOther,
  isPalindrome,
  findIndex,
  revString,
  gatherStrings,
  binarySearch
};
