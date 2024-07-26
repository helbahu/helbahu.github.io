import { useState } from "react";

const useFetch = () => {
    const [cards, setCards] = useState([]);
    const addCard = async () => {
      const response = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/draw/"
      );
      setCards(cards => [...cards, { ...response.data, id: uuid() }]);
    };
    
}

export default useFetch;