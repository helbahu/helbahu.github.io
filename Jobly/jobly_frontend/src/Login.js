import './Login.css';
import useForm from './useForm';
import FormInput from './FormInput';
import JoblyApi from './JoblyApi';
import useErrorMessages from './useErrorMessages';
import {useNavigate} from 'react-router-dom'
import { useContext } from 'react';
import UserContext from './UserContext';
import useLocalStorage from './useLocalStorage';
import useLoadingMessage from './useLoadingMessage';

const Login = () => {
    const [LoadingMessage,toggleLoadingState] = useLoadingMessage(false);
    const {setToken} = useLocalStorage();
    const {getUser} = useContext(UserContext);
    const navigate = useNavigate();
    const [messages,setMessages] = useErrorMessages();

    const INITIAL_STATE = {username: '', password: '' };
    const authenticateUser = async(data) => {
        try{
            toggleLoadingState(true);
            let res = await JoblyApi.authenticate(data);
            JoblyApi.token = res;
            getUser(data.username);
            setToken(res);
            navigate("/profile");
        }catch (err) {
            setMessages(messages=>err);
            toggleLoadingState(false);

        }
    }

    const [formData,handleChange,handleSubmit] = useForm(INITIAL_STATE,authenticateUser);
 
    return (
        <div className='Login'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} >
                <FormInput label='Username' name='username' value={formData.username} handleChange={handleChange} />
                <FormInput label='Password' name='password' value={formData.password} handleChange={handleChange} type='password' />

                <button><LoadingMessage text >Login</LoadingMessage></button>
            </form>
            {messages}
        </div>
    )

}
export default Login;