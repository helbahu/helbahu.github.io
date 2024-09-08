import { useState } from 'react';

const useForm = (initialState,callback) => {
    const [formData,setFormData] = useState(initialState);

    const resetForm = () => {
        setFormData(data=>initialState);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        await callback(formData);
        resetForm();
    }
    const handleChange = (e) => {        
        const name = e.target.name;
        const value = e.target.value;
        setFormData(data => ({...data, [name]: value}));
    }
 
    return [formData,handleChange,handleSubmit,resetForm];
}
export default useForm;