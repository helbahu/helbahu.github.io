import FormInput from './FormInput';
import './Form.css';
import useForm from './useForm';
import API from '../API';
import {useNavigate} from "react-router-dom";
import { Dispatch, useEffect, useState } from 'react';
import { UserRegisterInput } from '../Interfaces';
import useLocalStorage from './useLocalStorage';

interface ComponentObj {
    setIsLoggedIn: Dispatch<React.SetStateAction<boolean>>,
    postMessage:Function
}

const SignUp = ({setIsLoggedIn,postMessage}:ComponentObj) => {
    const [isLoadingButton,setIsLoadingButton] = useState(false);
    const navigate = useNavigate();

    const INITIAL_STATE = {name: '', email: '', bio:'', dateOfBirth: '', password: '', rePassword: ''};


    const register = async(submittedData:UserRegisterInput) => {
        const data:UserRegisterInput = {...submittedData}
        setIsLoadingButton(b=>true);

        try{
            if(data.password !== data.rePassword){
                postMessage("Passwords do not match",'danger');
            }else{
                delete data.rePassword;
    
                const res = await API.register(data);
                
                //Save to API class Object
                API.token = res.token;
                useLocalStorage.setToken(res.token)
                useLocalStorage.setUserId(res.user._id)
                setIsLoggedIn(bool=>true);
    
                navigate("/profile");
        
            }
    
        }catch(err:any){
            if(err.response.data.errors[0].message.includes("duplicate")){
                postMessage("An account is using this email address.",'danger')
            }
        }
        setIsLoadingButton(b=>false);

    }

    
    const [formData,handleChange,handleSubmit] = useForm(INITIAL_STATE,register);

    useEffect(()=>{
        const token = localStorage.getItem("eventBookUserToken");

        if(token){
            navigate("/profile")
        }

    },[])


    return(
        <div className='Form'>
            <h2 className='Form-Title' >Sign Up</h2>
            <form onSubmit={handleSubmit} >
                <FormInput label='Name' name='name' value={formData.name} handleChange={handleChange} />
                <FormInput label='Email' name='email' value={formData.email} handleChange={handleChange} />
                <FormInput label='Date of Birth' name='dateOfBirth' value={formData.dateOfBirth} handleChange={handleChange} type='date' />
                <FormInput label='Bio' name='bio' value={formData.bio} handleChange={handleChange} type='textarea' />

                <FormInput label='Password' name='password' value={formData.password} handleChange={handleChange} type='password' />
                <FormInput label='Re-Password' name='rePassword' value={formData.rePassword} handleChange={handleChange} type='password' />


                <button disabled={isLoadingButton} className='Form-Button'>{isLoadingButton ? "...Loading":"Register"}</button>
            </form>
        </div>
    )

}

export default SignUp;