class Boggle_Game {

    constructor(){
        this.wordArr = [];
        this.lettersArr = [];
        this.game_over = false;
                
    }

    clearVars(){
        this.wordArr = [];
        this.lettersArr = [];
    }
    
    board_click(e){
        if(this.game_over)return;
        let boxId = e.target.id;
        let ltr = e.target.innerText;
        if(this.wordArr.includes(boxId)){
            let idx = this.wordArr.indexOf(boxId);
            let removeLetters = this.wordArr.slice(idx);
            for(let r of removeLetters){
                $(`#${r}`).removeClass("selected");
            }
            this.wordArr = this.wordArr.slice(0,idx); 
            this.lettersArr = this.lettersArr.slice(0,idx); 
        }else{
            console.log(this.check_adjacent(boxId));
            if(!this.check_adjacent(boxId))return;
            $(e.target).toggleClass("selected");
            this.wordArr.push(boxId);
            this.lettersArr.push(ltr);
        }
    
    }

    check_adjacent(boxId){
        if(this.wordArr.length === 0){
            console.log("EMPTY WORD ARR");
            return true;
        }
        let lastLtr = this.wordArr[this.wordArr.length - 1];
        console.log(`LASTLTR = ${lastLtr}, is Y: ${lastLtr[0]} and X: ${lastLtr[2]}`);
        if((Math.abs(boxId[0] - lastLtr[0]) <= 1)&&(Math.abs(boxId[2] - lastLtr[2]) <= 1)){
            return true;
        }
        return false;        
    }

    fetch_func(entry,link,callback){

        let obj = {
            method: "POST",
            credentials: "include", //Note : thsi just includes thigs like cookies in the response
            body: JSON.stringify(entry),
            cache: "no-cache",
            headers: new Headers ({
                "content-type": "application/json"
            })
        };

        fetch(`${window.origin}/${link}`, obj)
        .then(res => res.json()).then(r => {
            callback(r);
        })

    }

    submit_word(){
        if(this.game_over)return;
        let word = ``;
        for(let ltr of this.lettersArr){
            word += ltr;
        }

        if(word !== ``){
            let entry = {
                "word": word
            };
    
            this.fetch_func(entry,`submit_word`,function(m){

                if(m.score !== undefined){
                    $('.score').text(`Score: ${m.score}`);            
                    $('.final_score').text(`Your final score is: ${m.score}.`);
    
                }
                if(m.longestWord !== undefined){

                    $('.final_longest_word').text(`The longest word you got was: ${m.longestWord}.`);
                }
    
                $('.flash_messages').empty();
                let p = $(`<p>`).addClass(m.class).text(m.message);
                $('.flash_messages').append(p);
                setTimeout(() => {
                    $(p).remove();
                }, 5000);
                
            })            
    
        } 
    
    
        //Clears selected off board
        for(let w of this.wordArr){
            $(`#${w}`).removeClass("selected");
        }
    
    
        //resets wordArr and lettersArr    
        this.clearVars();
    
    }

    timer(t){

        let elapsedTime = Math.round(parseFloat($(`#timer`).attr(`data-time`)));
        let countDown = t-elapsedTime;

        if (countDown <= 0){
            $(`#timer`).text(`Time Left: 0s`)
            this.game_over = true;
            $(".game_over").removeClass("d-none");
        
        }else{
            $(`#timer`).text(`Time Left: ${countDown}s`)
            let timeId = setInterval(() => {
                if (countDown <= 0){
                    $(`#timer`).text(`Time Left: 0s`)
                    clearInterval(timeId);
                    this.game_over = true;

                    $(".game_over").removeClass("d-none");
                
                    let entry = {
                        "status": "game_over"
                    };

                    this.fetch_func(entry,`update_stats`,function(m){
                        return;
                    });
                                  
                }else{
                    countDown--;
                    $(`#timer`).text(`Time Left: ${countDown}s`)
                }
        
            }, 1000);
                
        }
        
        

    }

    pageForm(e){
        if(this.game_over){
            e.preventDefault();
        }
    }

    activate_game(){
        
        this.timer(60);

        setTimeout(() => {
            $(".flash_messages").empty();
        }, 5000);

        $(".board").on("click",".board_box", this.board_click.bind(this));

        $('#submit_word').on('click', this.submit_word.bind(this));

        $(".page_change_form").on("submit",this.pageForm.bind(this));

        
    }


}

const newGame = new Boggle_Game();
newGame.activate_game();

