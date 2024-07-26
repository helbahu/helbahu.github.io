import React, { useEffect, useState } from "react";
import {v1 as uuid} from "uuid";
import axios from "axios";
import PlayingCard from "./PlayingCard";
import "./PlayingCardList.css";
import { useAxios, useLocalStorage } from "./hooks";

/* Renders a list of playing cards.
 * Can also add a new card at random. */
function CardTable() {
  const url = "https://deckofcardsapi.com/api/deck/new/draw";
  const [cards, addCard, clearTable] = useAxios(url, (data)=> ({ image: data.cards[0].image }),'cardsList');

  return (
    <div className="PlayingCardList">
      <h3>Pick a card, any card!</h3>
      <div>
        <button onClick={()=>addCard()}>Add a playing card!</button>
        <button onClick={clearTable}>Clear Table</button>
      </div>
      <div className="PlayingCardList-card-area">
        {cards.map(cardData => (
          <PlayingCard key={cardData.id} front={cardData.image} />
        ))}
      </div>
    </div>
  );
}

CardTable.defaultProps = {};

export default CardTable;
