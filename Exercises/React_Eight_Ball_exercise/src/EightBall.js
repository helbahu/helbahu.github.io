import {useState} from "react"
import './EightBall.css'
import RecordTable from "./RecordTable";

function EightBall (props) {

    const [eightBallProps,setEightBallProps] = useState({answer:"Think of a Question", color: "black"});
    const [colorCount,setColorCount] = useState({});

    const generateAnswer = () => {
        const randomIdx = Math.floor(Math.random()*props.answers.length);
        const randomAnswer = props.answers[randomIdx];
        setEightBallProps({answer: randomAnswer.msg, color: randomAnswer.color});
        randomAnswer.color in colorCount ?
            setColorCount({...colorCount, [randomAnswer.color]: colorCount[randomAnswer.color] + 1}):
            setColorCount({...colorCount, [randomAnswer.color]: 1});

    }
    const reset = () => {
        setEightBallProps({answer:"Think of a Question", color: "black"});
        setColorCount({});
    }

    return (
        <>
            <RecordTable data={colorCount} />
            <div className="EightBall" style={{backgroundColor:eightBallProps.color}} onClick={generateAnswer}>
                <h1 className="EightBall-Answer">
                    {eightBallProps.answer}
                </h1>
            </div>
            <div className="EightBall-ResetBtn">
                <button onClick={reset}>Reset</button>
            </div>
        </>
    )
}

export default EightBall;