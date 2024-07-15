import { useState } from 'react';
import './BoxList.css'
import Box from './Box';
import NewBoxForm from './NewBoxForm';
import {v4 as uuid} from 'uuid'

/**
 * 
 * @returns 
 * @props
 * @state - boxes
 */
const BoxList = () => {
    const [boxes,setBoxes] = useState([]);

    const addBox = (evt,formData)=>{
        evt.preventDefault();
        const {color, width, height} = formData;
        setBoxes(boxes => [...boxes,{id:uuid(), color, width, height}]);
    }

    const deleteBox = (id) => {
        setBoxes(boxes => boxes.filter(box => box.id !== id));
    }

    return (
        <div>
            <NewBoxForm addBox={addBox} />
            <div className='BoxList-Container'>
                {boxes.map(({id,color,width,height}) => <Box key={id} color={color} width={width} height={height} deleteBox={()=>deleteBox(id)} />)}
            </div>
        </div>
    )
}

export default BoxList;