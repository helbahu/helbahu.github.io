// PART1: NUMBER FACTS -------------------------------------------------------------------------------- PART1: NUMBER FACTS
const numbersBaseUrl = 'http://numbersapi.com';

const getNumberFact = async (number) => {
    let { data } = await axios.get(`${numbersBaseUrl}/${number}`);
    return data
}


// 1. Make a request to the Numbers API (http://numbersapi.com/) to get a fact about your favorite number. 
// (Make sure you get back JSON by including the json query key, specific to this API. Details.

const addNumberFactToList = async (number) =>{
    let num12Fact = await getNumberFact(number);
    let newLi = $('<li>').text(num12Fact)
    $('#numberFacts ol').append(newLi)    
}
addNumberFactToList(12);


// 2.  Figure out how to get data on multiple numbers in a single request. 
// Make that request and when you get the data back, put all of the number 
// facts on the page.
const addMultipleNumberFactsToList = async (numbersString) =>{
    let multipleNumFacts = await getNumberFact(numbersString);

    let newLi = $('<li>').text(`Facts for multiple numbers.`)
    let ul = $('<ul>')
    
    Object.values(multipleNumFacts).forEach(r => {
        let li = $('<li>').text(r)
        ul.append(li)    
    })
    
    newLi.append(ul)
    $('#numberFacts ol').append(newLi)
    
}
addMultipleNumberFactsToList('26,72,38..40');


// 3. Use the API to get 4 facts on your favorite number. Once you have them all, put them on the page. 
// It’s okay if some of the facts are repeats. (Note: You’ll need to make multiple requests for this.)

const addMultipleFactsForNumberToList = async (number) =>{
    let multipleNumFacts = await Promise.all([
        axios.get(`${numbersBaseUrl}/${number}`),
        axios.get(`${numbersBaseUrl}/${number}`),
        axios.get(`${numbersBaseUrl}/${number}`),
        axios.get(`${numbersBaseUrl}/${number}`)
    ]);

    let newLi = $('<li>').text(`Multiple facts for the number ${number}.`)
    let ul = $('<ul>')
    
    multipleNumFacts.forEach(r => {
        let li = $('<li>').text(r.data)
        ul.append(li)    
    })
    
    newLi.append(ul)
    $('#numberFacts ol').append(newLi)
    
}
addMultipleFactsForNumberToList(72);



// PART2: Deck of Cards -------------------------------------------------------------------------------- PART2: Deck of Cards

const cardsBaseUrl = 'https://deckofcardsapi.com/api/deck';

// 1.  Make a request to the Deck of Cards API to request a single card from a newly shuffled deck. 
// Once you have the card, console.log the value and the suit (e.g. “5 of spades”, “queen of diamonds”).
const getCardFromDeck = async (callback,deck_id='new',count=1) => {
    let res = await axios.get(`${cardsBaseUrl}/${deck_id}/draw/?count=${count}`)
    let card = res.data.cards[0]
    callback(card);
    return res
}

getCardFromDeck((card)=>{
    console.log(`${card.value} of ${card.suit}`);
})


//  2.  Make a request to the deck of cards API to request a single card from a newly shuffled deck. 
// Once you have the card, make a request to the same API to get one more card from the same deck.
// Once you have both cards, console.log the values and suits of both cards.
const getTwoCardsFromDeck = async (callback,deck_id='new') => {
    // NOTE: You could use the getCardFromDeck Function and have a count of 2 for this, but this question asks for 2 independent requests.

    let res1 = await axios.get(`${cardsBaseUrl}/${deck_id}/draw/?count=1`)
    let card1 = res1.data.cards[0];
    let d_id = res1.data.deck_id
    let res2 = await axios.get(`${cardsBaseUrl}/${d_id}/draw/?count=1`)
    let card2 = res2.data.cards[0];

    callback(card1,card2);
}

getTwoCardsFromDeck((card1,card2)=>{
    console.log(`Card 1: ${card1.value} of ${card1.suit}`);
    console.log(`Card 2: ${card2.value} of ${card2.suit}`);
})

// 3.  Build an HTML page that lets you draw cards from a deck. When the page loads, go to the Deck of Cards API to create a new deck, 
// and show a button on the page that will let you draw a card. Every time you click the button, display a new card, 
// until there are no cards left in the deck.

    //LOOK AT cards.html and cards.js



