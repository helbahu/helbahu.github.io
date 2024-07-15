import { useState } from 'react';
import './NewBoxForm.css'

const NewBoxForm = ({addBox}) => {
    const INITIAL_STATE = {color:'',width:100,height:100};
    const [formData,setFormData] = useState(INITIAL_STATE);

    const handleFormInputs = (e) => {
        const {name,value} = e.target;
        setFormData(formData =>({...formData, [name]:value}) );
    }

    return (
        <form onSubmit={(evt)=> [addBox(evt,formData),setFormData(INITIAL_STATE)]}>
            <label htmlFor='color'>Color: </label>
            <input id='color' name='color' type='text' onChange={handleFormInputs} value={formData.color}/>

            <label htmlFor='width'>Width: </label>
            <input id='width' name='width' type='number' min={10} max={1000} onChange={handleFormInputs} value={formData.width}/>

            <label htmlFor='height'>Height: </label>
            <input id='height' name='height' type='number' min={10} max={1000} onChange={handleFormInputs} value={formData.height}/>

            <button>Add Box</button>
        </form>
    )

}
export default NewBoxForm;