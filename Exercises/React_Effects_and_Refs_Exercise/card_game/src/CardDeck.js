import { useEffect, useRef, useState } from 'react';
import './CardDeck.css';
import Card from './Card';
import axios from 'axios';
import {v4 as uuid} from 'uuid';

function CardDeck() {
  const [cards,setCards] = useState([]);
  const [disabledBtn,setDisabledBtn] = useState(true);
  const [drawTimer,setDrawTimer] = useState(false);
  const deckId = useRef('new');
  const timerId = useRef();

  const drawCard = async ()=>{
    try{
      const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId.current}/draw/`);
      if(res.data.remaining === 0 && res.data.cards.length === 0){
        throw new Error("Error: No cards remaining.");        
      }
      const card = res.data.cards[0];
      setCards(cards => [...cards, {image: card.image, id: uuid()}]);
    }catch (err) {
      console.log(err.message);
      stopTimer();
      alert(err.message);
    }
  }

  const getNewDeck = async () => {
    setDisabledBtn(disable=>true);
    stopTimer();
    const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId.current}/shuffle/`);
    deckId.current = res.data.deck_id;
    setCards(cards => []);
    setDisabledBtn(disable=>false);
  }

    const drawCardTimer = () => {
        setDrawTimer(timer=>true);

        timerId.current = setInterval(() => {
            drawCard();
        }, 1000);
    }

    const stopTimer = () => {
        clearInterval(timerId.current);            
        setDrawTimer(timer=> false);
    }

    const drawCardTimerHandler = () => {
        if(!drawTimer){
            drawCardTimer();
        }else{
            stopTimer();
        }
    
    }

  useEffect(()=>{    
    getNewDeck();    

    return () => {
        clearInterval(timerId.current);
    }
  },[])

  return (
    <div className='CardDeck'>
      <div className='CardDeck-buttons'>
        <button className={drawTimer ? 'CardDeck-Disabled' : 'CardDeck-DrawBtn'} onClick={drawCard} disabled={drawTimer} >Draw Card</button>
        <button className='CardDeck-DrawBtn' onClick={drawCardTimerHandler}>{drawTimer ? 'Stop Drawing' : 'Start Drawing'}</button>
        <button className={disabledBtn ? 'CardDeck-Disabled' : 'CardDeck-NewDeckBtn'} onClick={getNewDeck} disabled={disabledBtn} >New Deck</button>
      </div>
      <div className='CardDeck-container'>
        { cards.length > 0 ?
            cards.map(card => <Card key={card.id} image={card.image} />):
            <Card image={null} />
        }

      </div>
    </div>
  );
}

export default CardDeck;
