import './SignUp.css';
import useForm from './useForm';
import FormInput from './FormInput';
import JoblyApi from './JoblyApi';
import useErrorMessages from './useErrorMessages';
import {useNavigate} from 'react-router-dom'
import { useContext } from 'react';
import UserContext from './UserContext';
import useLocalStorage from './useLocalStorage';
import useLoadingMessage from './useLoadingMessage';

const SignUp = () => {
    const [LoadingMessage,toggleLoadingState] = useLoadingMessage(false);

    const {setToken} = useLocalStorage();
    const {getUser} = useContext(UserContext);
    const navigate = useNavigate();
    const [messages,setMessages] = useErrorMessages();

    const INITIAL_STATE = {
        firstName: '',
        lastName: '',
        username: '', 
        email: '',
        password: '',
        repassword: '' 
    };
    const registerUser = async(data) => {
        try{
            toggleLoadingState(true);
            if(data.password === data.repassword){
                delete data.repassword;
                let res = await JoblyApi.register(data);
                JoblyApi.token = res;
                getUser(data.username);
                setToken(res);
                navigate("/profile");
            }else{
                console.log("Passwords must match.");
                setMessages(messages => ["Passwords must match."]);
                toggleLoadingState(false);

            }    
        }catch (err) {
            console.log(err);            
            setMessages(messages => err);
            toggleLoadingState(false);

        }

    }

    const [formData,handleChange,handleSubmit] = useForm(INITIAL_STATE,registerUser);


    return (
        <div className='SignUp'>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} >
                <FormInput label='First Name' name='firstName' value={formData.firstName} handleChange={handleChange} />
                <FormInput label='Last Name' name='lastName' value={formData.lastName} handleChange={handleChange} />
                <FormInput label='Username' name='username' value={formData.username} handleChange={handleChange} />
                <FormInput label='Email' name='email' value={formData.email} handleChange={handleChange} />
                <FormInput label='Password' name='password' value={formData.password} handleChange={handleChange} type='password' />
                <FormInput label='Re-enter Password' name='repassword' value={formData.repassword} handleChange={handleChange} type='password' />

                <button><LoadingMessage text >Register</LoadingMessage></button>
            </form>
            {messages}
        </div>
    )

}
export default SignUp;