import FormInput from './FormInput';
import './Form.css';
import useForm from './useForm';
import API from '../API';
import { useNavigate } from 'react-router-dom';
import { Dispatch, useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';

interface ComponentObj {
    setIsLoggedIn: Dispatch<React.SetStateAction<boolean>>,
    postMessage:Function
}

const Login = ({setIsLoggedIn,postMessage}:ComponentObj) => {
    const [isLoadingButton,setIsLoadingButton] = useState(false);

    const INITIAL_STATE = {email: '', password: ''};
    const navigate = useNavigate();

    const authenticateUser = async(data:{email:string,password:string}) => {
        setIsLoadingButton(b=>true);
        try{
            const res = await API.authenticateUser(data);
            
            //Save to API class Object
            API.token = res.token;
            useLocalStorage.setToken(res.token);
            useLocalStorage.setUserId(res.user._id)

            setIsLoggedIn(bool=>true);
            navigate("/profile");    
        }catch(err){
            postMessage("Invalid Username/Password.",'danger')
        }
        setIsLoadingButton(b=>false);
    
    }

    const [formData,handleChange,handleSubmit] = useForm(INITIAL_STATE,authenticateUser);

    useEffect(()=>{
        const token = useLocalStorage.getToken();

        if(token){
            navigate("/profile")
        }

    },[])


    return(
        <div className='Form'>
            <h2 className='Form-Title' >Login</h2>
            <form onSubmit={handleSubmit} >
                <FormInput label='Email Address' name='email' value={formData.email} handleChange={handleChange} />
                <FormInput label='Password' name='password' value={formData.password} handleChange={handleChange} type='password' />
                <button disabled={isLoadingButton} className='Form-Button'>{isLoadingButton ? "...Loading":"Login"}</button>
            </form>
        </div>
    )

}

export default Login;