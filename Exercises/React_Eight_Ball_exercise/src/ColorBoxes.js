import {useState,useEffect} from "react"
import './ColorBoxes.css'
import ColorBox from "./ColorBox";
import { getElementError } from "@testing-library/react";

function ColorBoxes ({colorList,gridW=4,gridH=4}) {
    const [boxColors, setBoxColors] = useState([]);

    const [rows,columns] = [[],[]];
    for(let i = 0; i < gridH; i ++) rows[i] = i;
    for(let i = 0; i < gridW; i ++) columns[i] = i;
    
    const getRandomColor = () => {
        const randomIdx = Math.floor(Math.random()*colorList.length);
        const randomColor = colorList[randomIdx];
        return {backgroundColor: randomColor}
    }

    const changeRandomBoxColor = () => {
        const randomIdx = Math.floor(Math.random()*(gridW*gridH));
        const boxColorsArray = [...boxColors];
        const beforeColor = boxColorsArray[randomIdx];
        boxColorsArray[randomIdx] = getRandomColor();
        if(beforeColor === boxColorsArray[randomIdx]) boxColorsArray[randomIdx] = getRandomColor();
        setBoxColors(boxColorsArray);
    }

    useEffect(()=>{
        const boxColorsArray = [];
        for(let i = 0; i < gridH*gridW; i ++){
            boxColorsArray[i] = getRandomColor();
        };
        setBoxColors(boxColorsArray);
    },[])

    return (
        <>
            <div className="ColorBoxes">
                {rows.map(row=>{
                    return <div key={row} className="ColorBoxes-Row">
                                {columns.map(col=>{
                                    const boxKey = row*gridH + col;
                                    return <ColorBox boxKey={boxKey} color={boxColors[boxKey]}/> 
                                })}
                            </div>
                })}
            </div>
            <div className="ColorBoxes-ChangeBtn">
                <button onClick={changeRandomBoxColor}>Change</button>
            </div>
        </>
    )

}

export default ColorBoxes;