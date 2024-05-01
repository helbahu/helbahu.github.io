const cardsBaseUrl = 'https://deckofcardsapi.com/api/deck';

const $cardBox = $('.cardBox');
const $remainingCardsNum = $('.remainingCardsNum');

// 3.  Build an HTML page that lets you draw cards from a deck. When the page loads, go to the Deck of Cards API to create a new deck, 
// and show a button on the page that will let you draw a card. Every time you click the button, display a new card, 
// until there are no cards left in the deck.

// When the page loads, a new deck is chosen.
let deck_id;

const getNewShiffledDeck = async (num_of_decks=1) => {
    let {data} = await axios.get(`${cardsBaseUrl}/new/shuffle/?deck_count=${num_of_decks}`)
    $cardBox.empty();
    deck_id = data.deck_id;
    $remainingCardsNum.text(data.remaining)
}

getNewShiffledDeck();

// When the refresh/new deck button is clicked, a new deck is chosen.
$('.newDeck_btn').on('click',()=>{
    getNewShiffledDeck();
})


// Retrieves a card from the deck.
const getCardFromDeck = async (deck_id='new',count=1) => {
    let res = await axios.get(`${cardsBaseUrl}/${deck_id}/draw/?count=${count}`)

    $cardBox.empty();
    $remainingCardsNum.text(res.data.remaining)

    if(res.data.remaining > 0){
        let card = res.data.cards[0];

        let heading = $('<h2>').text(`${card.value} of ${card.suit}`);
        let img = $('<img>').attr('src',card.image);

        $cardBox.append(heading);
        $cardBox.append(img);    
    }else{
        let heading = $('<h2>').text(`Out of Cards!`);
        $cardBox.append(heading);
    }

}

$('.drawCard').on('click',()=>{
    getCardFromDeck(deck_id=deck_id)
})
