import './ColorBoxes.css'

function ColorBox ({boxKey,color}) {
    return (
            <div key={boxKey} className="ColorBoxes-Box" style={color}> 
                {boxKey}
            </div>
            )

}

export default ColorBox;