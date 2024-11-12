import FormInput from './FormInput';
import './Form.css';
import useForm from './useForm';
import API from '../API';
import {useNavigate} from "react-router-dom";
import { Dispatch, useEffect, useState } from 'react';
import { EditUserInput, UserObj } from '../Interfaces';
import useLocalStorage from './useLocalStorage';

interface ComponentObj {
    initialState: {name:string,bio:string,dateOfBirth:string},
    setUser:Dispatch<React.SetStateAction<UserObj | undefined>>,
    postMessage:Function,
    toggleUserForm:Function
}

const EditProfileForm = ({initialState,setUser,postMessage,toggleUserForm}:ComponentObj) => {
    const [isLoadingButton,setIsLoadingButton] = useState(false);

    const userId = useLocalStorage.getUserId();

    const navigate = useNavigate();

    const formatDate = (dateTime:string) => {
        let dateObj = new Date(dateTime);
        
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        return `${year}-${month < 10 ? `0${month}`:month}-${day < 10 ? `0${day}`:day}`;
    }

    const INITIAL_STATE = {name:initialState.name,bio:initialState.bio, dateOfBirth:formatDate(initialState.dateOfBirth), password: '', rePassword: ''};


    const updateUser = async(data:EditUserInput) => {
        setIsLoadingButton(b=>true);

        const updateUserObj:EditUserInput = {};

        if(data.name !== INITIAL_STATE.name)updateUserObj.name = data.name;
        if(data.bio !== INITIAL_STATE.bio) updateUserObj.bio = data.bio;
        if(data.dateOfBirth !== INITIAL_STATE.dateOfBirth) updateUserObj.dateOfBirth = data.dateOfBirth;
        if(data.password !== INITIAL_STATE.password){
            if(data.password === data.rePassword){
                updateUserObj.password = data.password;
            }else{
                postMessage("Passwords do not match.",'danger');
            }

        } 

        if(userId){
            const res = await API.updateUser(userId,updateUserObj);
            setUser(user=>({...user,...res}));
            postMessage("Updated profile successfully.",'success');
            toggleUserForm();
    
        }
        setIsLoadingButton(b=>false);


    }

    
    const [formData,handleChange,handleSubmit] = useForm(INITIAL_STATE,updateUser);

    useEffect(()=>{
        const token = localStorage.getItem("eventBookUserToken");

        if(token && userId){
            navigate("/profile")
        }

    },[])


    return(
        <div className='Form'>
            <h2 className='Form-Title' >Edit Profile</h2>
            <form onSubmit={handleSubmit} >
                <FormInput label='Name' name='name' value={formData.name} handleChange={handleChange} />
                <FormInput label='Date of Birth' name='dateOfBirth' value={formData.dateOfBirth} handleChange={handleChange} type='date' />
                <FormInput label='Bio' name='bio' value={formData.bio} handleChange={handleChange} type='textarea' />

                <FormInput label='Password' name='password' value={formData.password} handleChange={handleChange} type='password' required={false} />
                <FormInput label='Re-Password' name='rePassword' value={formData.rePassword} handleChange={handleChange} type='password'  required={false}/>


                <button disabled={isLoadingButton} className='Form-Button'>{isLoadingButton ? "...Loading" : "Update"}</button>
            </form>
        </div>
    )

}

export default EditProfileForm;