const fs = require('fs');
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

cat(argv[2]);
