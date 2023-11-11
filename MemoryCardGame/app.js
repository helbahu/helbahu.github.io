//Game Parameters
    //The gameDifficultyCardNumber variable is a number declared when the player selects a difficulty. The number denotes the number of cards generated in the memory game.
    let gameDifficultyCardNumber;
    //This value will be easy,medium,hard,or veryhard (depending no the difficulty button clicked).
    let difficultyValue;
    //The timeRecord variable is a numeric value (time in seconds). When a player plays the game for the first time, the value is infinity, but if the player has played the 
    //level before, timeRecord will be equal to the best time the player has completed the level at. It will be compared to the finishTime to see if a new best time occurs.
    //The best time is recorded in the achievements section. 
    let timeRecord = Infinity;
    //timerId will be used to cancel the timer at the end of the game. 
    let timerId;

    //guessScore is the value of the lowest number of guesses 
    let guessScore = Infinity;
    let currentGuessScore = 0;

    //Color setting is to enable background color change during gameplay
    let colorEnabled = true;

    //This value will be declared when the player finishes the game. It is equal to the amount of time it took to complete the game (in seconds).
    //Note: finishTimeString is the finishTime value converted to a string with the time format.
    let finishTime;
    let finishTimeString;
    //The cards object will be declared when the player selects a difficulty and it is an object with the 2 keys: back and face. The back key has the image for the back of
    //the card and the face value is an aray with all the images of a genre. Note: cardsBack and cardsFace are equal to cards.back and cards.face respectively. 
    let cards;
    let cardsBack;
    let cardsFace;
    //The modeSetting variable is used to set the theme of the app. The value is equal to a CSS class. There are currently 3 modes: default, dark and bright.
    let modeSetting = `default`;
    //The memoryCards variable is a node array of all the cards generated for the game. It is used with an addEventListener to listen for clicks on the images.
    let memoryCards;
    //gameOver is a boolean that is used to initiate the clearInterval(timerId) function for the timer when the last card is picked.
    let gameOver;

//-------------------------------------------------------------

//Game Objects

    //cardObj contains urls for all card images for the game. When a player selects a genre, it selects an object corresponding to the key (genre). This new
    //object contains 2 keys, back and face. The back key is a url for an image for the back of the card, and the face key is an array of urls for all genre cards.
    const cardObj = {
        "genreMythology":{
            back: "Assets/MythologyCardsBack.png",
            face: [
                "Assets/MythologyCardAnubis.png",
                "Assets/MythologyCardCerberus.png",
                "Assets/MythologyCardCeto.png",
                "Assets/MythologyCardCountDracula.png",
                "Assets/MythologyCardDragon.png",
                "Assets/MythologyCardFreyja.png",
                "Assets/MythologyCardHades.png",
                "Assets/MythologyCardIcarus.png",
                "Assets/MythologyCardKraken.png",
                "Assets/MythologyCardLoki.png",
                "Assets/MythologyCardMedusa.png",
                "Assets/MythologyCardMermaid.png",
                "Assets/MythologyCardMinotaur.png",
                "Assets/MythologyCardOdin.png",
                "Assets/MythologyCardPegasus.png",
                "Assets/MythologyCardPhoenix.png",
                "Assets/MythologyCardPoseidon.png",
                "Assets/MythologyCardQuetzalcoatl.png",
                "Assets/MythologyCardThor.png",
                "Assets/MythologyCardZeus.png"
            ]
        },
        "genreHorror":{
            back: "Assets/HorrorCardBack.png",
            face: [
                "Assets/HorrorCardAnnabelle.png",
                "Assets/HorrorCardBabadook.png",
                "Assets/HorrorCardBabaYegaHouse.png",
                "Assets/HorrorCardCthulu.png",
                "Assets/HorrorCardDraugr.png",
                "Assets/HorrorCardGrimReaper.png",
                "Assets/HorrorCardJackTheRipper.png",
                "Assets/HorrorCardJasonVoorhees.png",
                "Assets/HorrorCardLaLiorona.png",
                "Assets/HorrorCardPennywise.png",
                "Assets/HorrorCardPinheadHellraiser.png",
                "Assets/HorrorCardPlagueDoctor.png",
                "Assets/HorrorCardSkinWalker.png",
                "Assets/HorrorCardSlenderMan.png",
                "Assets/HorrorCardVampire.png",
                "Assets/HorrorCardWeepingAngel.png",
                "Assets/HorrorCardWerewolf.png",
                "Assets/HorrorCardWitch.png",
                "Assets/HorrorCardYokai.png",
                "Assets/HorrorCardZombie.png"    
            ]
        },
        "genreAnimals":{
            back: "Assets/AnimalsCardBack.png",
            face: [
                "Assets/AnimalsCardAlligator.png",
                "Assets/AnimalsCardAntelope.png",
                "Assets/AnimalsCardDeer.png",
                "Assets/AnimalsCardFox.png",
                "Assets/AnimalsCardGorilla.png",
                "Assets/AnimalsCardGrizzlyBear.png",
                "Assets/AnimalsCardKangaroo.png",
                "Assets/AnimalsCardLemur.png",
                "Assets/AnimalsCardLion.png",
                "Assets/AnimalsCardLizard.png",
                "Assets/AnimalsCardLynx.png",
                "Assets/AnimalsCardOstrich.png",
                "Assets/AnimalsCardOwl.png",
                "Assets/AnimalsCardRabbit.png",
                "Assets/AnimalsCardSnake.png",
                "Assets/AnimalsCardSquirrel.png",
                "Assets/AnimalsCardSwan.png",
                "Assets/AnimalsCardTiger.png",
                "Assets/AnimalsCardWolf.png",
                "Assets/AnimalsCardZebra.png"    
            ]
        },
        "genreAll": 1
    }

    //pageObj contains keys that correspond to values of buttons we click and depending on which button is pressed, it will go to that page by executing a function.
    //The functions give the invoked page a class depending on the modeSetting value. Note: The current page will be set to inactive (class with display:inactive in CSS). 
    const pageObj = {
        "menuPlay": function(){
            let page = document.querySelector(`#difficulty`);
            page.setAttribute(`class`,modeSetting);
        },
        "menuGenre": function(){
            let page = document.querySelector(`#genre`);
            page.setAttribute(`class`,modeSetting);
        },
        "menuSettings": function(){
            let page = document.querySelector(`#settings`);
            page.setAttribute(`class`,modeSetting);
        },
        "menuAchievements": function(){
            let page = document.querySelector(`#achievments`);
            page.setAttribute(`class`,modeSetting);
        },
        "backToMain": function(){
            let page = document.querySelector(`#main`);
            page.setAttribute(`class`,modeSetting);
        },
        "startGame": function(){
                let page = document.querySelector(`#gameTable`);
                page.setAttribute(`class`,modeSetting); 
        },
        "playAgain": function(){
            let page = document.querySelector(`#difficulty`);
            page.setAttribute(`class`,modeSetting); 
        },
        "clear": function(){
            location.reload();
        },
        "clear1": function(){
            localStorage.setItem(`page`,`true`);
            location.reload();
        }
    }

    //difficultyObj is set once the difficulty is selected (buttons have values corresponding to the keys in this object). Once a difficulty is selected,
    //the gameDifficultyCardNumber will be equal to num, and an id is selected which will be used to set the timeRecord variable. Also a guessId will be 
    //selected to set the guessScore variable. 
    const difficultyObj = {
        "easy": {
            num: 12,
            currentId: `#timeEasy`,
            guessId: `#guessEasy`
        },
        "medium": {
            num: 20,
            currentId: `#timeMedium`,
            guessId: `#guessMedium`
        },
        "hard": {
            num: 30,
            currentId: `#timeHard`,
            guessId: `#guessHard`
        },
        "very hard": {
            num: 40,
            currentId: `#timeVeryHard`,
            guessId: `#guessVeryHard`
        }
    }

    //gameGridSettings is an object with keys corresponding to one of the possible values of gameDifficultyCardNumber. The values correspond to CSS classess
    //and this will set the formatting of the game grid in CSS. 
    const gameGridSettings = {
        12: `easyGrid`,
        20: `mediumGrid`,
        30: `hardGrid`,
        40: `veryHardGrid`
    }

    //settingsObj has 1 key: modeToggle. modeToggle is used to toggle the value of modeSetting for different themes.
    const settingsObj = {
        "modeToggle": function(){
            let status = document.querySelector(`#modeText`);
            let page = document.querySelector(`#settings`);
            switch(status.innerText){
                case "Mode: Default": (function(){
                    status.innerText = "Mode: Dark";
                    modeSetting = `dark`;
                })();
                break;
                case "Mode: Dark": (function(){
                    status.innerText = "Mode: Bright"
                    modeSetting = `bright`;
                })();
                break;
                case "Mode: Bright": (function(){
                    status.innerText = "Mode: Default"
                    modeSetting = `default`;
                })();
            }
            page.setAttribute(`class`,modeSetting);
            document.querySelector(`body`).setAttribute(`class`,modeSetting);
            localStorage.setItem(`theme`,modeSetting);
            localStorage.setItem(`themeText`,status.innerText);
        },
        "colorToggle": function(){
            let status = document.querySelector(`#colorText`);
            colorEnabled = !colorEnabled;
            status.innerText === `Gameplay Color: Enabled` ? status.innerText = `Gameplay Color: Disabled`:status.innerText = `Gameplay Color: Enabled`;
            localStorage.setItem(`colorEnabled`,colorEnabled);
            console.log(`Local Storage : ${localStorage.getItem(`colorEnabled`)}`);
        }
    }

    let achievementsObj = {
        "#timeEasy": `-`,
        "#timeMedium": `-`,
        "#timeHard": `-`,
        "#timeVeryHard": `-`,
        "#guessEasy": `-`,
        "#guessMedium": `-`,
        "#guessHard": `-`,
        "#guessVeryHard": `-`        
    }
    

//-----------------------------------

//KeyFunctions

    //The timeString function is used to convert the best time to a value in seconds (if a best time exists). Then the timeRecord will be set to this value. 
    function timeString(diffId){
        let x = document.querySelector(diffId).innerText;
        if(x !== `-`){
            let timeArr = x.split(`:`);
            if(timeArr.length === 2){
                timeRecord = parseFloat(timeArr[1]) + (parseFloat(timeArr[0]) * 60);
            }else{
                timeRecord = parseFloat(timeArr[2]) + (parseFloat(timeArr[1]) * 60) + (parseFloat(timeArr[0]) * 3600);
            }
        }else{
            timeRecord = Infinity;
        }
    }


    //This guessScore function is used to convert the best guess to a number value (if a best guess score exists). Then the guessScore will be set to that value. 
    function guessScoreX(diffGuess){
        let x = document.querySelector(diffGuess).innerText;
        if(x !== `-`){
            guessScore = x;
        }else{
            guessScore = Infinity;
        }
    }

    //This is a function for the timer of the game.
    function gameTimer(){
        let timer = document.querySelector(`#timer`);
        let sec = 0;
        let min = 0;
        let hour = 0;
        let s;
        let m;
        let h;
        timerId = setInterval(function(){
            sec++;
            if(sec === 60){
                min++;
                sec = 0;
            }
            if(min === 60){
                hour++;
                min = 0;
            }
            hour >= 10 ? h = `${hour}:`:h = `0${hour}:`;
            min >= 10 ? m = `${min}:`:m = `0${min}:`;
            sec >= 10 ? s = `${sec}`:s = `0${sec}`;
            
            hour === 0? timer.innerText = m+s:timer.innerText = h+m+s;

            if(gameOver){
                clearInterval(timerId);
                finishTime = (hour*3600)+(min*60)+(sec);

                hour === 0? finishTimeString = m+s:finishTimeString = h+m+s;
                let resultPhrase = document.querySelectorAll(`#gameOverNotification p`);
                resultPhrase[0].innerText = `You finished in ${finishTimeString}! It took you ${currentGuessScore} guesses (best possible score is ${gameDifficultyCardNumber}).`;
                if((finishTime<timeRecord)&&(timeRecord !== Infinity)){
                    resultPhrase[1].innerText = `Great Job, you beat your old time record!`;
                    let obj = JSON.parse(localStorage.getItem(`achievements`));
                    obj[difficultyObj[difficultyValue].currentId] = finishTimeString;
                    localStorage.setItem(`achievements`,JSON.stringify(obj));    
                }else{
                    resultPhrase[1].innerText = `Play again and try to beat your time record!`;
                    if(timeRecord === Infinity){
                        if(localStorage.getItem(`achievements`)){
                            let obj = JSON.parse(localStorage.getItem(`achievements`));
                            obj[difficultyObj[difficultyValue].currentId] = finishTimeString;
                            localStorage.setItem(`achievements`,JSON.stringify(obj));    
                        }else{
                            achievementsObj[difficultyObj[difficultyValue].currentId] = finishTimeString;
                            localStorage.setItem(`achievements`,JSON.stringify(achievementsObj));    
                        }
                    }
                }                                        


                if((currentGuessScore<guessScore)&&(guessScore !== Infinity)){
                    if(currentGuessScore !== gameDifficultyCardNumber){
                        resultPhrase[2].innerText = `Great Job, you beat your old score!`;
                        let obj = JSON.parse(localStorage.getItem(`achievements`));
                        obj[difficultyObj[difficultyValue].guessId] = currentGuessScore;
                        localStorage.setItem(`achievements`,JSON.stringify(obj));    
    
                    }else if(currentGuessScore === gameDifficultyCardNumber){
                        resultPhrase[2].innerText = `Amazing, you got the best possible score for this level!`;
                        let obj = JSON.parse(localStorage.getItem(`achievements`));
                        obj[difficultyObj[difficultyValue].guessId] = currentGuessScore;
                        localStorage.setItem(`achievements`,JSON.stringify(obj));    
                    }

                }else{


                    resultPhrase[2].innerText = `Play again and try to beat your Guess Score!`;
                    if(guessScore === Infinity){

                        if(localStorage.getItem(`achievements`)){
                            let obj = JSON.parse(localStorage.getItem(`achievements`));
                            
                            obj[difficultyObj[difficultyValue].guessId] = currentGuessScore;
                            localStorage.setItem(`achievements`,JSON.stringify(obj));    
                        }else{
                            achievementsObj[difficultyObj[difficultyValue].guessId] = currentGuessScore;
                            localStorage.setItem(`achievements`,JSON.stringify(achievementsObj));    
                        }
                    }
                }                                        
            }
        },1000)
    }

    //This function generates random colors for the memory game.
    function makeRandomColor(){
        let h = Math.floor(Math.random()*360);
        let s = Math.floor(Math.random()*100);
        let l = Math.floor(Math.random()*40)+10;

        return `hsl(${h},${s}%,${l}%)`;
    };



//-----------------------------------

//When Page Starts Up 

    //This sets the values in the achievements section. If the player played the game before, it will update using localStorage.
    for(let key in achievementsObj){
        let score = document.querySelector(key);

        if(localStorage.getItem(`achievements`)){
            let obj = JSON.parse(localStorage.getItem(`achievements`));
            score.innerText = obj[key];
            console.log(`this is the key: ${key} and this is the value: ${obj[key]}`);
        }else{
            score.innerText = achievementsObj[key];
        }
    }

    //This sets the theme of the page depending on the players last preference.
    if(localStorage.getItem(`theme`)){
        let theme = document.querySelector(`#main`);
        let body = document.querySelector(`body`);
        theme.setAttribute(`class`,localStorage.getItem(`theme`));
        body.setAttribute(`class`,localStorage.getItem(`theme`));
        let settingText = document.querySelector(`#modeText`);
        settingText.innerText = localStorage.getItem(`themeText`);
    }

    //This checks if the players last action was clicking the play again button or not. If so, it will send the player to the Difficulty page. 
    if(localStorage.getItem(`page`) === `true`){
        let main = document.querySelector(`#main`);
        main.setAttribute(`class`,`inactive`);
        pageObj[`menuPlay`]();
    }
    localStorage.setItem(`page`,`false`);

    if(localStorage.getItem(`colorEnabled`) === `false`){
        console.log(`HEEELOOOO`);
        console.log(localStorage.getItem(`colorEnabled`));
        let status = document.querySelector(`#colorText`);
        status.innerText = `Gameplay Color: Disabled`;
        colorEnabled = false;
    }


//--------------------------------------

//MainPage

//mainBtns is a node array that contains all buttons in the application.
const mainBtns = document.querySelectorAll(`button`);

//This loop will iterate over mainBtns so we can add an addEventListener.
for(let btn of mainBtns){

    //This is an addEventListener that listens for any button that is clicked in the application.
    btn.addEventListener(`click`,function(event){
        //Some buttons in the HTML have a value parameter with a unique string. The valu parameter will have a value equal to the clicked button's value parameter string. 
        let valu = event.target.value;
        
        //This conditional looks for any button wiht a valu equal to any key inside the pageObj. This is where the functionality for changing a page occurs. 
        if(pageObj[valu] !== undefined){
            
            //This conditional checks if the value is equal to startGame. If so, it will also check if a difficulty has not been selected.
            //If a difficulty has not been selected, then ti will invoke an animation in a CSS class called `instructionsDiffWarning` to
            //warn the player. Otherwise it will inactivate the current page and activate the desired page using the pageObj.
            if((valu === "startGame")&&(gameDifficultyCardNumber === undefined)){
                let instruction = document.querySelector(`.instructionsDiff`);
                instruction.setAttribute(`class`,`instructionsDiffWarning`);
                setTimeout(function(){
                    instruction.setAttribute(`class`,`instructionsDiff`);
                },600)
            }else{
                event.target.parentElement.setAttribute(`class`,`inactive`);
                pageObj[valu]();            
            } 
        
        }

        //This conditional looks for any button with a value equal to any key inside the settingsObj. This is where the functionality for changing the theme occurs.
        if(settingsObj[valu] !== undefined){
            settingsObj[valu]();
        }

        //This conditional looks for any button with a value equal to any key inside the difficultyObj. This is where the functionality for setting the difficulty occurs.
        if(difficultyObj[valu] !== undefined){
            difficultyValue = valu;
            //This is where gameDifficultyCardNumber is declared.        
            gameDifficultyCardNumber = difficultyObj[valu].num;

            //This is where timeRecord is declared. 
            let currentTimeId = difficultyObj[valu].currentId;
            timeString(currentTimeId);

            //This is where guessScore is declared.
            let guessId = difficultyObj[valu].guessId;
            guessScoreX(guessId);
            
            //This is where we set the color of the selected difficulty button. It works as a radio input, where only one of the buttons will have the btnSelected style.
            let diffBtns = document.querySelectorAll(`#difficulty button.diffBtn`);
            for(let btn of diffBtns){
                if(btn === event.target){
                    btn.classList.add(`btnSelected`);
                }else if(btn.classList.contains(`btnSelected`)){
                    btn.classList.remove(`btnSelected`);
                }
            }
            
        }

        //This conditional looks for any button with a value equal to any key inside the cardObj. This is where the cards, cardsBack, and cardsFace variables are declared.        
        if(cardObj[valu] !== undefined){

            // This is where cards is declared depending on the genre selected. The conditional checks for the valu of the button clicked. If the valu is equal to genreAll
            // then cards.back will have a value of a random url from one of the genres, and cards.face will be an array of all the genre arrays concatenated.
            // If the genre is anything else, it will set the cards variable to the corresponding array in the cardObj.
            if(valu === "genreAll"){
                cards = {};
                cards.back = [cardObj.genreMythology.back,cardObj.genreHorror.back,cardObj.genreAnimals.back][Math.floor(Math.random()*3)];
                cards.face = [].concat(cardObj.genreMythology.face,cardObj.genreHorror.face,cardObj.genreAnimals.face);
            }else{
                cards = cardObj[valu];
            }

            //This is where cardsBack and cardsFace are declared.
            cardsBack = cards.back;
            cardsFace = cards.face;

            //This is where the btnSelected style is set to the selected genre.
            let genreBtns = document.querySelectorAll(`#genre button.genreBtn`);
            for(let btn of genreBtns){
                if(btn === event.target){
                    btn.classList.add(`btnSelected`);
                }else if(btn.classList.contains(`btnSelected`)){
                    btn.classList.remove(`btnSelected`);
                }
            }
        }

        //This conditional is activated once the startGame button is clicked and a difficulty is selected.
        if((valu === "startGame")&&(gameDifficultyCardNumber !== undefined)){
            //This conditional checks if a genre was selected (by checking if cards is empty or not). If the player hasn't selected a genre 
                //this will set the default to genreAll.
            if(cards === undefined){
                cards = {};
                cards.back = [cardObj.genreMythology.back,cardObj.genreHorror.back,cardObj.genreAnimals.back][Math.floor(Math.random()*3)];
                cards.face = [].concat(cardObj.genreMythology.face,cardObj.genreHorror.face,cardObj.genreAnimals.face);
                cardsBack = cards.back;
                cardsFace = cards.face;    
            }

            //newArr is a copy of cardsFace. We use newArr instead of cardsFace because when we select random cards, we want to remove selected cards from the array.
            let newArr = cardsFace.slice();

            //TThe gameSettings variable gets the key value of the gameGridSettings corresponding to the gameDifficultyCardNumber. Then we will add the class to the
                //gameTable. This will format the gameTable in CSS. 
            let gameSettings = gameGridSettings[gameDifficultyCardNumber];
            let gameTable = document.querySelector(`#cardContainer`).classList;
            gameTable.add(gameSettings);
            //this loop tests for if the gametable contains unnecessary classes and removes them.
            for(let key in gameGridSettings){
                if(parseFloat(key) !== gameDifficultyCardNumber){
                    gameTable.remove(gameGridSettings[key]);
                } 
            }

            //This Function Will generate a random array with the length of gameDifficultyCardNumber and 2 cards of a kind.
                //cardFaceUrls is an array with length of gameDifficultyCardNumber/2 and will have 1 card of a kind. The following
                //loop will ensure that only 1 card of a kind is added through a random selection process. 
                let cardFaceUrls = [];
                let colorArr = [];
                for(let i = 0;i<(gameDifficultyCardNumber/2);i++){
                    let randNum = Math.floor(Math.random()*newArr.length);
                    let newCard =newArr[randNum];
                    let randomColor = makeRandomColor();
                    colorArr.push(randomColor);
                    cardFaceUrls.push(newCard);
                    newArr.splice(randNum,1);
                }

                //numArr is an array with the length of gameDifficultyCardNumber and has values corresponding to their respective indicies. 
                //This will be used to assign each img (card) to the cardArr (below) at an index corresponding to the value of the randomly
                //selected value of the numArr. This method is chosen to ensure all indecies aof cardArr are assigned a value and that any
                //index that has already been assigned a value is not chosen again. 
                let numArr = [];
                for(let i=0;i<gameDifficultyCardNumber;i++){
                    numArr.push(i);
                }

                //cardArr will be an array with length of gameDifficultyCardNumber and it will be asssigned a url for each index. This array will have 2
                //cards of a kind at random indices.                      
                //The final result is cardArr which has the right number of cards for the difficulty and also has the right genre and they are randomized.
                let cardArr = [];
                let colorArr2 = [];
                for(let i = 0;i<cardFaceUrls.length;i++){
                    let n = 0;
                    while(n<2){
                        let randNum = Math.floor(Math.random()*numArr.length);
                        let index = numArr[randNum];
                        cardArr[index] = cardFaceUrls[i];
                        colorArr2[index] = colorArr[i];
                        numArr.splice(randNum,1);
                        n++;
                    }
                }
                
            //Now that we have a random array we can go to the follwoing loop which will generate a grid that has
            //the right number of cards and we will give each spot (div) an image with the corresponding url in cardArr.
            let appendTo = document.querySelector(`#cardContainer`);
            for(let i = 0;i<gameDifficultyCardNumber;i++){
                let newDiv = document.createElement(`div`);
                newDiv.setAttribute(`class`,`cardDiv`);
                let newImg = document.createElement(`img`);
                newImg.setAttribute(`class`,`card`);
                newImg.setAttribute(`src`,cardsBack);
                newImg.setAttribute(`data-url`,cardArr[i]);
                newImg.setAttribute(`data-color`,colorArr2[i]);
                newDiv.append(newImg);
                appendTo.append(newDiv);
            }

            //memoryCards is a node array with all the generated cards (all images were given a class of card).
            memoryCards = document.querySelectorAll(`.card`);
            //The counter variable is used in the card.addEventListener to test how many cards are face up. This will only allow 2 cards to be face up at a time. 
            let counter = 0;
            //This is an array with 2 cards in 
            let faceUpCards = [];
//-------------!!!!!!!!!!!!!!!!!!!!!!!!!!!
            let scoreVal = document.querySelector(`#guessValSpan`);
            let gameTableColor = document.querySelector(`#gameTable`);
            
            //NOTIFICATION BEFORE GAME STARTS
            let notificationNewGame = document.querySelector(`#letsPlayNotification`);
            notificationNewGame.setAttribute(`class`,`notifications`);

            //This loop will listen to any card that is clicked.
            for(let card of memoryCards){
                card.addEventListener(`click`,function(event){
                    if(card.getAttribute(`class`) !== `card`){return;}
                    if(counter<2){
                        currentGuessScore++;
                        scoreVal.innerText = currentGuessScore;
                        colorEnabled ? gameTableColor.style.backgroundColor = card.getAttribute(`data-color`):null;
                    }

                    //This conditional tests if 2 cards have been flipped over. The maximum number of cards allowerd.
                    if((counter<2)||(faceUpCards[0] === faceUpCards[1])){
                        //This conditional tests if a clicked card is face up, if so, reduce counter by 1.
                        if((card.getAttribute(`src`) !== cardsBack)){
                            if(faceUpCards[0] === faceUpCards[1]){
                                counter = 0;
                                faceUpCards = [];
                            }else{
                                counter--;
                                faceUpCards.splice(faceUpCards.indexOf(card),1);    
                            }
                        }else if(card.getAttribute(`src`) === cardsBack){
                            //This conditional tests if the clicked card is face down, if so, increase counter by 1.
                            counter++;
                            faceUpCards.push(card);
                            card.classList.remove(`card`);
                        }
                        
                        //This will execute if the counter is <2 (as the conditional allows). This will toggle the face with the back when the card is clicked.                    
                        let currentFace = card.getAttribute(`src`);
                        let hiddenFace = card.getAttribute(`data-url`);        
                        //This will enable the animation for the card flip.
                        card.classList.add(`cardClick`);
                        //This will change the card when the card is 50% through the animation, when the card is on its side, to simulate the card flipping. 
                        setTimeout(function(){
                            card.setAttribute(`src`,hiddenFace);
                            card.setAttribute(`data-url`,currentFace);    
                        },300)
                        //This will end the flip animation after its elapsed time. 
                        setTimeout(function(){
                            card.classList.remove(`cardClick`);
                        },600)
                            
                    }

                    //This conditonal is where the game's logic works. This will test if the two selected cards are a match or not. 
                    if((counter === 2)&&(faceUpCards[0] !== faceUpCards[1])){
                        let card1;
                        let card2;
                        let faceUp1 = faceUpCards[0].getAttribute(`src`);
                        let faceUp2 = faceUpCards[1].getAttribute(`src`);
                        faceUp1 === cardsBack ? card1 = faceUpCards[0].getAttribute(`data-url`):card1 = faceUp1;
                        faceUp2 === cardsBack ? card2 = faceUpCards[1].getAttribute(`data-url`):card2 = faceUp2;

                        if(card1 === card2){
                            setTimeout(function(){
                                if(faceUpCards[0].getAttribute(`src`) === faceUpCards[1].getAttribute(`src`)){
                                    faceUpCards[0].classList.remove(`card`);
                                    faceUpCards[1].classList.remove(`card`);
                                    counter = 0;
                                    faceUpCards = [];
                                    if(!document.querySelector(`.card`)){
                                        gameOver = true;
                                        let gameOverNotification = document.querySelector(`#gameOverNotification`);
                                        gameOverNotification.setAttribute(`class`,`notifications`);

                                    }        
                                }
                            },1000)
                        }else if(card1 !== card2){
                            //This will enable the animation for the card flip.
                            setTimeout(function(){
                                faceUpCards[0].classList.add(`cardClick`);
                                faceUpCards[1].classList.add(`cardClick`);
                                setTimeout(function(){
                                    for(let c of faceUpCards){
                                        let currentFace = c.getAttribute(`src`);
                                        let hiddenFace = c.getAttribute(`data-url`);                    
                                        c.setAttribute(`src`,hiddenFace);
                                        c.setAttribute(`data-url`,currentFace);        
                                    }
                                },300)
                                setTimeout(function(){
                                    for(let c of faceUpCards){
                                        c.classList.remove(`cardClick`);
                                    }
                                    counter = 0;
                                    faceUpCards = [];    
                                },600)
                                faceUpCards[0].classList.add(`card`);
                                faceUpCards[1].classList.add(`card`);

                            },1000)
                        }



                    }

                })
            }
                    


        }
        if(valu === `letsPlay`){
            let notificationNewGame = document.querySelector(`#letsPlayNotification`);
            notificationNewGame.setAttribute(`class`,`inactive`);
            gameTimer();
        }


})
}





