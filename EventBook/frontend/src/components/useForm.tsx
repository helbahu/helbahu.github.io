import { useState } from 'react';


const useForm = (initialState:any,callback:Function) => {
    const [formData,setFormData] = useState(initialState);

    const resetForm = () => {
        setFormData((data:any)=>initialState);
    }

    const handleSubmit = async(e:any) => {
        e.preventDefault();
        await callback(formData);
        resetForm();
    }
    const handleChange = (e:any) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData((data:any) => ({...data, [name]: value}));
    }

    return [formData,handleChange,handleSubmit,resetForm,setFormData];
}
export default useForm;