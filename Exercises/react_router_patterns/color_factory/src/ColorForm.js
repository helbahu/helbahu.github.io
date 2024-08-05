import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import './ColorForm.css';
import {v4 as uuid } from 'uuid';

const ColorForm = ({addColor}) => {
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        name: '',
        value: ''
    });

    const handleChange = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setFormData(formData=>({...formData,[name]:value}));
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        addColor(colors=>{
            const newColorsList = [{...formData,id:uuid()},...colors]
            const colrosString = JSON.stringify(newColorsList);
            localStorage.setItem("colorsList",colrosString);
            return newColorsList;
        });
        navigate('/colors');
    }


    return (
        <div className='ColorForm'>
            <form onSubmit={handleSubmit}>
                <h2>Add A New Color.</h2>
                <label>Name: 
                    <input className='ColorForm-Name' onChange={handleChange} name='name' value={formData.name} type='text' placeholder='Name of Color' />
                </label>
                <label>Value: 
                    <input onChange={handleChange} name='value' value={formData.value} type='color' />
                </label>
                <button>Add Color</button>
            </form>
        </div>
    )

}
export default ColorForm;