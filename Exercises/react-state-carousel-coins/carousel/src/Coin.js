import { useState } from "react";
import "./Coin.css";
import coinObj from "./coinObj";
import CoinScoreboard from "./CoinScoreboard";

function Coin () {
    const [coin,setCoin] = useState({currentSide:null, headsCount:0, tailsCount:0})

    const flipCoin = () => {
        const {src,side} = coinObj[Math.floor(Math.random()*2)];
        const coinData = {...coin};
        side === 'heads' ? coinData.headsCount++ : coinData.tailsCount++;
        coinData.currentSide = src;
        setCoin(coinData);
    }

    return (
        <div>
            <div style={{height:'250px'}}>
            {coin.currentSide ?
            <img src={coin.currentSide} alt=""/> :
            <div style={{paddingTop:'100px'}}>
                <h2>Flip the coin to get started.</h2>
            </div>
            }
            </div>
            <button className="Coin-Btn" onClick={flipCoin}>Flip</button>
            <CoinScoreboard headsCount={coin.headsCount} tailsCount={coin.tailsCount}/>
        </div>
    )
}

export default Coin;