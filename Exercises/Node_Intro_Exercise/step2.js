const fs = require('fs');
const axios = require('axios');
const { webcrypto } = require('crypto');
const argv = process.argv;


const cat = (file)=>{

    fs.readFile(file,'utf8',(err,data)=>{
        if(err){
            console.log(`Error reading ${file}:`)
            console.log(` `,err.message)
            process.exit(1);
        }else{
            console.log(data);
        }
    })    

}

const webCat = (url)=>{
    axios.get(url)
    .then(res=>{
        console.log(res.data);

    })
    .catch(err=>{
        console.log(`Error fetching ${url}:`);
        console.log('  Error: Request failed with status code',404);
        process.exit(1);

    })

}



const isUrl = (input)=>{
    if((input.indexOf('http://') > -1) || (input.indexOf('https://') > -1)){
        return true
    }else{
        return false
    }
}

let input = argv[2];

if(isUrl(input)){
    webCat(input);
}else{
    cat(input);
}

