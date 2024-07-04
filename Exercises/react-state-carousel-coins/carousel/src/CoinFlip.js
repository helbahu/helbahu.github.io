import { useState } from "react";
import "./CoinFlip.css";
import Coin from "./Coin";

function CoinFlip () {

    return (
        <div>
            <h1>Let's Flip a Coin</h1>
            <Coin/>
        </div>
    )

}

export default CoinFlip;