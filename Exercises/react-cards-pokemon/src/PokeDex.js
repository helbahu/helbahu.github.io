import React, { useState } from "react";
import {v1 as uuid} from "uuid";
import axios from "axios";
import PokemonSelect from "./PokemonSelect";
import PokemonCard from "./PokemonCard";
import "./PokeDex.css";
import { useAxios } from "./hooks";

/* Renders a list of pokemon cards.
 * Can also add a new card at random,
 * or from a dropdown of available pokemon. */
function PokeDex() {
  const url = 'https://pokeapi.co/api/v2/pokemon';
  const [pokemon,addPokemon,clearPokeDex] = useAxios(url,(data)=>({ key: data.id,
                                                                    front: data.sprites.front_default,
                                                                    back: data.sprites.back_default,
                                                                    name: data.name,
                                                                    stats: data.stats.map(stat => ({
                                                                      value: stat.base_stat,
                                                                      name: stat.stat.name
                                                                    }))
                                                    }),'pokemonList');

  return (
    <div className="PokeDex">
      <div className="PokeDex-buttons">
        <h3>Please select your pokemon:</h3>
        <PokemonSelect add={addPokemon} />
        <button onClick={clearPokeDex}>Clear PokeDex</button>
      </div>
      <div className="PokeDex-card-area">
        {pokemon.map(cardData => (
          <PokemonCard
            key={cardData.key}
            front={cardData.front}
            back={cardData.back}
            name={cardData.name}
            stats={cardData.stats}
          />
        ))}
      </div>
    </div>
  );
}

export default PokeDex;
