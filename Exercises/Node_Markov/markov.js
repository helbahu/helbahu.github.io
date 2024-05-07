/** Textual markov chain generator */
const fs = require('fs')
const axios = require('axios');

class MarkovMachine {

    /** build markov machine; read in text.*/
  
    constructor(text,type='string') {
      this.punctuations = ['.',',',';','!','?','...','***'];

      if(type === 'string'){
        let words = text.split(/[ \s\r\n]+/);
        this.words = words.filter(c => c !== "");
        this.makeChains();  
      }

      if(type === 'file'){
        if(text.includes('http://') || text.includes('https://')){
            MarkovMachine.readUrl(text,(data)=>{
                let words = data.split(/[ \s\r\n]+/);
                this.words = words.filter(c => c !== "");
                this.makeChains();                              
            })
        
        }else{
            MarkovMachine.readFile(text,(data)=>{
                let words = data.split(/[ \s\r\n]+/);
                this.words = words.filter(c => c !== "");
                this.makeChains();                          
            })
    
        }
    
      }


    }
  
    /** set markov chains:
     *
     *  for text of "the cat in the hat", chains will be
     *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */
  
    makeChains() {
      let chains = {};
      for(let i = 0;i < this.words.length;i++){
        // console.log(i,this.words[i])
        let word = this.words[i];
        if(chains[this.wordSlice(word)]){
            this.punctuations.includes(word[word.length-1]) ? chains[this.wordSlice(word)].push(null):chains[this.wordSlice(word)].push(this.wordSlice(this.words[i+1]));
        }else{
            this.punctuations.includes(word[word.length-1]) ? chains[this.wordSlice(word)] = [null]:chains[this.wordSlice(word)] = [this.wordSlice(this.words[i+1])];
        }

      }
      this.chains = chains;
    }
  
  
    /** return random text from chains */
  
    makeText(numWords = 100) {
      const chains = this.chains;
      let randomWordIndex = Math.floor(Math.random()*Object.keys(chains).length);
      let currWord = this.wordSlice(this.words[randomWordIndex]);
      let text = this.capitalizeFirstLetter(currWord);
      let wordNum = 1;

      while(wordNum < numWords){
        let currWordChain = chains[currWord];
        let randomWordIndex = Math.floor(Math.random()*currWordChain.length);
        let nextWord = currWordChain[randomWordIndex];

        if(nextWord){
            text[text.length-1] === '.' ? text = text + ` ${this.capitalizeFirstLetter(nextWord)}` : text = text + ` ${nextWord}`;
            currWord = nextWord
        }else{
            if(text[text.length-1] === '.'){
                currWord = this.wordSlice(this.words[Math.floor(Math.random()*this.words.length)])
                text = text + ` ${this.capitalizeFirstLetter(currWord)}`;

            }else{
                text = text + `.`;
                currWord = this.wordSlice(this.words[Math.floor(Math.random()*this.words.length)])
                text = text + ` ${this.capitalizeFirstLetter(currWord)}`;

            }

        }

        wordNum++;
      }
      text = text + `.`;
      console.log(text);      
      return text;
    }

    wordSlice(word){
        if(!word)return;
        if(this.punctuations.includes(word[word.length-1])){
            return word.slice(0,word.length-1)            
        }else{
            return word
        }
        
    }

    capitalizeFirstLetter(string) {
        return string[0].toUpperCase() + string.slice(1);
    }


    static readFile(file,callback){
        fs.readFile(file,'utf8',(err,data)=>{
            if(err){
                console.log('ERROR: ',err.message)
                process.exit(1);        

            }else{
                callback(data);
            }
        })
        
    }

    static readUrl(textUrl,callback){
        axios.get(textUrl)
        .then(res=>{
            callback(res.data);
        })
        .catch(err=>{
            console.log(`Error fetching ${textUrl}:`,err);
            console.log('  Error: Request failed with status code',404);
            process.exit(1);        
        })        
        
    }


    
}

module.exports = { MarkovMachine }
