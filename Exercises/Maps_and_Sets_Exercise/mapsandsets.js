//Maps and Sets Exercise


    /*
    Quick Question #1
    What does the following code return?
    */
    new Set([1,1,2,2,3,4]); // {1,2,3,4}

    /*
    Quick Question #2
    What does the following code return?
    */
    [...new Set("referee")].join(""); //"ref"

    /*
    Quick Questions #3
    What does the Map "m" look like after running the following code?
    */
    let m = new Map();
    m.set([1,2,3], true);
    m.set([1,2,3], false);
    m; // 0: {Array(3) => true} 
       // 1: {Array(3) => false}. This is because the arrays may look identical but have different references.     

    /*
    hasDuplicate
    Write a function called hasDuplicate which accepts an array and returns true or false if that array contains a duplicate
    */
    const hasDuplicate = arr => (arr.length !== new Set(arr).size);
    //hasDuplicate([1,3,2,1]) // true
    //hasDuplicate([1,5,-1,4]) // false

    /*
    vowelCount
    Write a function called vowelCount which accepts a string and returns a map where the keys are numbers and the values are the count of the vowels in the string.
    */
    const vowelCount = str => {
        const m = new Map();
        str.toLowerCase().split(``).forEach(ltr =>{
            if(`aeiou`.includes(ltr)){
                if(!m.has(ltr)){
                    m.set(ltr,1);
                }else{
                    let n = m.get(ltr) + 1;
                    m.set(ltr,n);
                }
            }
        });        
        return m;
    }



