import { useState } from 'react';
import './PopUp.css'

const PopUp = (props) => {
    
    return (
        <>
            {props.isActive &&
            <div className='PopUp-Background'>
                <div className='PopUp'>
                    <div className='PopUp-Cancel' >
                        <button onClick={props.closePopUp}>Cancel</button>
                    </div>
                    {props.children}
                </div>
            </div>    
            }
        </>
    )

}
export default PopUp;