import "./Coin.css";

function CoinScoreboard ({headsCount,tailsCount}) {
    return (
        <div>
            <h2>Score</h2>
            <h3>Heads: {headsCount}</h3>
            <h3>Tails: {tailsCount}</h3>                
        </div>
    )

}
export default CoinScoreboard;