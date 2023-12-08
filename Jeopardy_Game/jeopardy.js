//---------------------------------------------------------------------------------------------------Header
const $header = $(`<div>`).addClass(`header`);
const $title = $(`<h1>`).addClass(`title`).text(`Jeopardy!`);
const $startBtn = $(`<button>`).attr(`id`,`startBtn`).attr(`data-clicked`,`false`).text(`Start!`);
$title.appendTo($header);
$startBtn.appendTo($header);
$header.appendTo($(`body`));

//---------------------------------------------------------------------------------------------------Game board
const $mainDiv = $(`<div>`).addClass(`jeopardyDiv`);
const $table = $(`<table>`).attr(`id`,`jeopardy`).append(`<thead>`,`<tbody>`);
$table.appendTo($mainDiv);
$mainDiv.appendTo(`body`);

//Spinner
const $spinner = $(`<i>`).attr(`id`,`spinner`).addClass(`fas fa-spinner`);



//---------------------------------------------------------------------------------------------------Functions

//randomNum is a function used to give a random integer between 0 and n (not including n).
const randomNum = (n) => (Math.floor(Math.random()*n));



// categories is the main data structure for the app. It is where the data for the categories and clues is stored.
/*Here is an exaple of the structure of categories:
 [
   { title: "Math",
     clues: [
       {question: "2+2", answer: 4, showing: null},
       {question: "1+1", answer: 2, showing: null}
       ...
     ],
   },
   { title: "Literature",
     clues: [
       {question: "Hamlet Author", answer: "Shakespeare", showing: null},
       {question: "Bell Jar Author", answer: "Plath", showing: null},
       ...
     ],
   },
   ...
 ]

*/
let categories = [];


//This function will get 100 categories from a random index (offset parameter) and from these 100 categories, 6 are randomly selected.
 //This function returns an array of 6 category ids.
async function getCategoryIds() {
    //a Set is chosen over an array because it has a built in mechanism to prevent duplicates.
    const idSet = new Set();

    //NOTE max offset is 28063, sow randomNum(28064) would be used to get max variety, but for now we'll focus on the top 5000 categories
    let categories = await axios.get(`https://jservice.io/api/categories`,{params:{count:100,offset:randomNum(28064)}});

    //We need 6 different categories.
    while(idSet.size < 6){
        //will select a random category.
        let category = categories.data[randomNum(100)];

        //NOTE some categories have less than 5 clue, so we need to avoid those by checking if clues_count >= 5.
        if(category.clues_count >= 5){
            idSet.add(category.id);    
        }
    }

    return [...idSet];
}



/** Return object with data about a category:
 */

//numArr will take a number (in this case its the length of an array) and it will make an array of every number from 0 to that number,
    //Then it will sort the array randomly, then it will return an array of 5 numbers.
function numArr(n){
    let arr = [];
    for(let i = 0; i < n; i++){
        arr.push(i);
    }
    let randomArray = arr.sort(()=> (randomNum(3)-1));
    let x = randomNum(randomArray.length-4);
    let slice = randomArray.slice(x,x+5);
    return slice;
}

//fiveRandomClues will take an array of clues, then it will create a new clue array with only 5 clues.
    //It uses the numArr function to chose 5 random clues.
function fiveRandomClues(clueArr){
    const fiveClues = [];
    const l = clueArr.length;
    const arr = numArr(l);
    for(let idx of arr){
        fiveClues.push(clueArr[idx]);
    }
    return fiveClues;    
}


//This function accepts a category id, then it will get the data from the api of that category. 
    //This function will return an object with 2 keys, a title of the category, and the clues array.
    //Each clue is an object with 3 keys: question, answer, and showing (showing is used in the clicking event listener).
async function getCategory(catId) {
    let category = await axios.get(`https://jservice.io/api/category`,{params:{id: catId}});
    let {clues,title} = category.data;
    //gets 5 random clues.
    clues = fiveRandomClues(clues);
    //extracts only the relevant data from the clues, so we don't have unneccesary keys.
    clues = clues.reduce(function(acc,clue){
        acc.push({question: clue.question, answer: clue.answer, showing: null});
        return acc;
    },[]);
    return {title,clues};
}



/** Fill the HTML table#jeopardy with the categories & cells for questions.
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */
//createCategoryTr takes a parent and appends the 6 category titles to the parent (in this case <thead>).
function createCategoryTr(parent){
    const $categoryRow = $(`<tr>`).attr(`id`,`categoryRow`);
    for(let category of categories){
        const $td = $(`<td>`).html(category.title);
        $td.appendTo($categoryRow);
    }
    $categoryRow.appendTo(parent);
}

//createQTr accepts a parent and makes 5 rows of 6 questions, giving the row an id to represent the question index
    //and giving each <td> an index to represent the category.
function createQTr(parent){
    for(let q = 0; q < 5; q++){
        const $tr = $(`<tr>`).attr(`id`,`q-${q}`);
        for(let c = 0;c < 6;c++){
            const $td = $(`<td>`).attr(`id`,`${q}-${c}`).addClass(`question`).html(`?`);
            $td.appendTo($tr); 
        }
        $tr.appendTo(parent);
    }
}

//fillTable will execute the 2 above functions, creating the headings for the categories and the boxes for the questions.
    //When they are appended to the table, it will also hideLoadingView() (explained below).
async function fillTable() {
    createCategoryTr($table.children(`thead`));
    createQTr($table.children(`tbody`));
    hideLoadingView();
}



/** Handle clicking on a clue: show the question or answer.
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let c = evt.target.id[2];
    let q = evt.target.id[0];
    //gets the clue based on the clicked box's id.
    let clue = categories[c].clues[q];
    if(clue.showing === null){
        clue.showing = `question`;
        evt.target.innerHTML = categories[c].clues[q].question;    
    }else if(clue.showing === `question`){
        clue.showing = `answer`;
        evt.target.style.backgroundColor = `#28a200`;
        evt.target.innerHTML = categories[c].clues[q].answer;    
    }    
    
}

//this is the event listener for clicking the questions.
$(`body`).on(`click`,`.question`,handleClick);


/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    if($startBtn.attr(`data-clicked`) === `true`)return;
    $startBtn.text(`Loading...`);
    $startBtn.attr(`data-clicked`,`true`);
    $table.children(`thead`).empty();
    $table.children(`tbody`).empty();
    $spinner.appendTo(`body`);
    categories = [];
    setupAndStart();        

}
//this is the event listener for clicking the start/restart button.
$startBtn.on(`click`,showLoadingView);


/** Remove the loading spinner and update the button used to fetch data. */
function hideLoadingView() {
    $startBtn.text(`Restart!`);
    $startBtn.attr(`data-clicked`,`false`);
    $spinner.remove();
}


/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

//This function sets up and starts the game.
async function setupAndStart() {
    //Get 5 random category ids, catIds is an array.
    const catIds = await getCategoryIds();

    //for each id in catIds, it will get the data for that category and add it to the categories array.
    for(let id of catIds){
        const category = await getCategory(id);
        categories.push(category);
    }

    //NOTE: Some clues have a strange case where the question and the answer are both `=`. To avoid this, I made this test variable.
    let test = categories.some(category =>{
        let stat = category.clues.some(clue => `=`.includes(clue.question));
        return stat;
    });

    if(!test){
        //once the categories and clues have been selected, it will populate the table.
        fillTable();
    }else{
        //In the case where a clue fails the test, it will clear categories and try again.
        categories = [];        
        return setupAndStart();
    }

}
