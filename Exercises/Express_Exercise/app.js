const express = require('express')
const fs = require('fs')
const ExpressError = require('./expressError')

const mean = require('./mean')
const median = require('./median')
const mode = require('./mode')

const app = express();

app.use(express.json())

const allNumsValid = (nums) => {
    for(let n of nums){
        if(isNaN(parseFloat(n)))return [false,n];
    }
    return [true];
}

const splitNums = (queryNums,next) => {
    let nums;
    if(queryNums){
        nums = queryNums.split(',');
    }

    try{
        if (!nums)throw new ExpressError(`Numbers are required.`,400);
        let result = allNumsValid(nums);
        if (!result[0])throw new ExpressError(`${result[1]} is not a number.`,400);
        return nums;
    }catch (err){
        console.log(err)
        return next(err)
    }
}

const saveResults = (nums,resultsObj,next,outputFile='results.json')=>{
    let inputData = {...resultsObj,nums:nums};
    fs.writeFile(outputFile,JSON.stringify(inputData),'utf8',(err,data)=>{
        if(err){
            return next(new ExpressError(err.message,500))
        }else{
            console.log(`Data copied to ${outputFile} successfuly.`);
        }
    })        
    
}


app.get('/mean',(req,res,next)=>{
    let nums = splitNums(req.query.nums,next);
        
    console.log(nums);
    let meanVal = mean(nums);
    let resultJson = {response: {
        operation: "mean",
        value: meanVal
    }};
    if(req.query.save)saveResults(nums,resultJson,next);
    res.status(201).json(resultJson);
})

app.get('/median',(req,res,next)=>{
    let nums = splitNums(req.query.nums,next);

    console.log(nums);
    let medianVal = median(nums);
    let resultJson = {response: {
        operation: "median",
        value: medianVal
    }};
    if(req.query.save)saveResults(nums,resultJson,next);
    res.status(201).json(resultJson);

})

app.get('/mode',(req,res,next)=>{
    let nums = splitNums(req.query.nums,next);

    console.log(nums);
    let modeVal = mode(nums);
    let resultJson = {response: {
        operation: "mode",
        value: modeVal
    }};
    if(req.query.save)saveResults(nums,resultJson,next);
    res.status(201).json(resultJson);

})

app.get('/all',(req,res,next)=>{
    let nums = splitNums(req.query.nums,next);

    console.log(nums);

    let meanVal = mean(nums);
    let medianVal = median(nums);
    let modeVal = mode(nums);
    let resultJson = {response: {
        operation: "all",
        mean: meanVal,
        median: medianVal,
        mode: modeVal
    }};
    if(req.query.save)saveResults(nums,resultJson,next);
    res.status(201).json(resultJson);

})


app.use((err,req,res,next)=>{
    console.log(err.msg,err.status)
    res.send(err.msg)
})

app.listen(4000,()=>{
    console.log("Server running on Port 4000")
});
