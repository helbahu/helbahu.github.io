const fs = require('fs');
const axios = require('axios');
const { webcrypto } = require('crypto');
const argv = process.argv;


const cat = (file,callback)=>{
    fs.readFile(file,'utf8',(err,data)=>{
        if(err){
            console.log(`Error reading ${file}:`)
            console.log(` `,err.message)
        }else{
            callback(data);
        }
    })    
}

const webCat = (url,callback)=>{
    axios.get(url)
    .then(res=>{
        callback(res.data);
    })
    .catch(err=>{
        console.log(`Error fetching ${url}:`);
        console.log('  Error: Request failed with status code',404);
    })

}

const isUrl = (input)=>{
    if((input.indexOf('http://') > -1) || (input.indexOf('https://') > -1)){
        return true
    }else{
        return false
    }
}

const catWrite = (inputData,outputFile)=>{
    fs.writeFile(outputFile,inputData,'utf8',(err,data)=>{
        if(err){
            console.log(`Couldn't write ${file}:`)
            console.log(` Error:`,err.message)
        }else{
            console.log(`Data copied to ${outputFile} successfuly.`);
        }
    })        
}


let input = argv[2];

if(isUrl(input)){
    webCat(input,(data)=>{
        console.log(data);
    });
}else if(input === '--out'){
    let outputFilename = argv[3]
    let readFileOrUrl = argv[4]
    console.log(`Will copy the data from ${readFileOrUrl} to ${outputFilename}`)

    if(isUrl(readFileOrUrl)){
        webCat(readFileOrUrl,(data)=>{
            catWrite(data,outputFilename);
        });    
    }else{
        cat(readFileOrUrl,(data)=>{
            catWrite(data,outputFilename);
        });
    }

}else{
    cat(input,(data)=>{
        console.log(data);
    });
}
