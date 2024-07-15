import { useState } from 'react';
import './Box.css'

const Box = ({color,width,height,deleteBox}) => {
    const [deleteBtn,setDeleteBtn] = useState(false);
    return (
        <div className='Box' 
             style={{backgroundColor:color,width:`${width}px`,height:`${height}px`}}
             onMouseEnter={()=>setDeleteBtn(true)}
             onMouseLeave={()=>setDeleteBtn(false)}>
            {deleteBtn && <button className='Box-DeleteBtn' onClick={deleteBox}>X</button>}
        </div>
    )
}
export default Box;