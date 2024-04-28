// PART1: NUMBER FACTS -------------------------------------------------------------------------------- PART1: NUMBER FACTS
const numbersBaseUrl = 'http://numbersapi.com';

const getNumberFact = (number) => {
    return axios.get(`${numbersBaseUrl}/${number}`)
}


// 1. Make a request to the Numbers API (http://numbersapi.com/) to get a fact about your favorite number. 
// (Make sure you get back JSON by including the json query key, specific to this API. Details.

getNumberFact(12)
.then((res)=>{
    console.log(res.data);
    let newLi = $('<li>').text(res.data)
    $('#numberFacts ol').append(newLi)

})
.catch((err)=>console.log(err))


// 2.  Figure out how to get data on multiple numbers in a single request. 
// Make that request and when you get the data back, put all of the number 
// facts on the page.

getNumberFact('26,72,38..40')
.then((res)=>{
    console.log(Object.values(res.data));

    let newLi = $('<li>').text(`Facts for multiple numbers.`)
    let ul = $('<ul>')

    Object.values(res.data).forEach(r => {
        let li = $('<li>').text(r)
        ul.append(li)    
    })

    newLi.append(ul)
    $('#numberFacts ol').append(newLi)
    
})
.catch((err)=>console.log(err))


// 3. Use the API to get 4 facts on your favorite number. Once you have them all, put them on the page. 
// It’s okay if some of the facts are repeats. (Note: You’ll need to make multiple requests for this.)

let selectedNum = 72

let newLi3 = $('<li>').text(`Multiple facts for the number ${selectedNum}.`)
let ul3 = $('<ul>')
getNumberFact(selectedNum)
.then((res)=>{
    let li = $('<li>').text(res.data)
    ul3.append(li)    
    return getNumberFact(selectedNum)
})
.then((res)=>{
    let li = $('<li>').text(res.data)
    ul3.append(li)    
    return getNumberFact(selectedNum)
})
.then((res)=>{
    let li = $('<li>').text(res.data)
    ul3.append(li)    
    return getNumberFact(selectedNum)
})
.then((res)=>{
    let li = $('<li>').text(res.data)
    ul3.append(li)    
})
.catch((err)=>console.log(err))

newLi3.append(ul3)
$('#numberFacts ol').append(newLi3)

// NOTE: THIS COULD ALSO BE DONE USING Promise.all as shown below
let selectedNum2 = 84

const number84PromisesArr = []
for(let i = 0;i<4;i++){
    number84PromisesArr.push(getNumberFact(selectedNum2))
}

Promise.all(number84PromisesArr)
.then((resArr)=>{
    let newLi = $('<li>').text(`Facts for the number ${selectedNum2}.`)
    let ul = $('<ul>')

    resArr.forEach(res => {
        let li = $('<li>').text(res.data)
        ul.append(li)    
    })

    newLi.append(ul)
    $('#numberFacts ol').append(newLi)

})
.catch((err)=>console.log(err))



// PART2: Deck of Cards -------------------------------------------------------------------------------- PART2: Deck of Cards

const cardsBaseUrl = 'https://deckofcardsapi.com/api/deck';

// const getNewShiffledDeck = (num_of_decks=1) => {
//     return axios.get(`${cardsBaseUrl}/new/shuffle/?deck_count=${num_of_decks}`)
// }


// 1.  Make a request to the Deck of Cards API to request a single card from a newly shuffled deck. 
// Once you have the card, console.log the value and the suit (e.g. “5 of spades”, “queen of diamonds”).
const getCardFromDeck = (deck_id='new',count=1) => {
    return axios.get(`${cardsBaseUrl}/${deck_id}/draw/?count=${count}`)
}
getCardFromDeck()
.then(res=>{
    let card = res.data.cards[0]
    console.log(`${card.value} of ${card.suit}`);
})
.catch(err=>console.log(err))


//  2.  Make a request to the deck of cards API to request a single card from a newly shuffled deck. 
// Once you have the card, make a request to the same API to get one more card from the same deck.
// Once you have both cards, console.log the values and suits of both cards.

getCardFromDeck()
.then(res=>{
    let card = res.data.cards[0];
    console.log(`Card 1: ${card.value} of ${card.suit}`);

    let deck_id = res.data.deck_id;
    return getCardFromDeck(deck_id = deck_id);
})
.then(res=>{
    let card = res.data.cards[0];
    console.log(`Card 2: ${card.value} of ${card.suit}`);

})
.catch(err=>console.log(err))


// 3.  Build an HTML page that lets you draw cards from a deck. When the page loads, go to the Deck of Cards API to create a new deck, 
// and show a button on the page that will let you draw a card. Every time you click the button, display a new card, 
// until there are no cards left in the deck.

    //LOOK AT cards.html and cards.js

