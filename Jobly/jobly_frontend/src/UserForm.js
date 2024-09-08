import './SignUp.css';
import useForm from './useForm';
import FormInput from './FormInput';
import JoblyApi from './JoblyApi';
import useErrorMessages from './useErrorMessages';
import ExpressError from './expressError';
import useLoadingMessage from './useLoadingMessage';

const UserForm = ({hideForm,setUsers=null,setUser=null,initialState={}}) => {
    const [LoadingMessage,toggleLoadingState] = useLoadingMessage(false);

    const [messages,setMessages] = useErrorMessages();

    const INITIAL_STATE = {
        firstName: initialState.firstName || '',
        lastName: initialState.lastName || '',
        username: '', 
        email: initialState.email || '',
        isAdmin: false,
        password: '',
        repassword: '' 
    };
    const addOrUpdateUser = async(data) => {
        try{
            toggleLoadingState(true);
            if(data.password !== data.repassword) throw new ExpressError("The passwords must match.");

            delete data.repassword;

            if(setUsers){
                data.isAdmin === 'true' ? data.isAdmin = true : data.isAdmin = false;

                let res = await JoblyApi.addUser(data);
                setUsers(users=>[...users,res]);
            }else if(setUser){
                delete data.username;
                delete data.isAdmin;
                if(data.password === '') delete data.password;
                let res = await JoblyApi.updateUser(initialState.username,data);
                setUser(user=>({...user,...data}));
            }
            toggleLoadingState(false);
            hideForm();
        }catch (err) {
            if(err.message){
                setMessages(messages => [err.message]);
            }else{
                setMessages(messages => err);
            }
            toggleLoadingState(false);

        }

    }

    const [formData,handleChange,handleSubmit,resetForm] = useForm(INITIAL_STATE,addOrUpdateUser);

    return (
        <div className='SignUp'>
            <h2>{setUsers ? "Add New User":"Update User"}</h2>
            <form onSubmit={handleSubmit} >
                <FormInput label='First Name' name='firstName' value={formData.firstName} handleChange={handleChange} />
                <FormInput label='Last Name' name='lastName' value={formData.lastName} handleChange={handleChange} />
                {setUsers && <FormInput label='Username' name='username' value={formData.username} handleChange={handleChange} />}
                <FormInput label='Email' name='email' value={formData.email} handleChange={handleChange} />

                {setUsers && 
                    <FormInput label='Make an Admin' name='isAdmin' value={formData.isAdmin} handleChange={handleChange} type='select'>
                        <option value={false}>No</option>
                        <option value={true}>Yes</option>
                    </FormInput>
                }

                <FormInput label='Password' name='password' value={formData.password} handleChange={handleChange} type='password' required={setUsers} />
                <FormInput label='Re-enter Password' name='repassword' value={formData.repassword} handleChange={handleChange} type='password' required={setUsers} />
                
                <div>
                    <button><LoadingMessage text >{setUsers ? "Add User":"Update User"}</LoadingMessage></button>
                    <button className='AddProfileForm-Cancel-Btn' type='button' onClick={()=>[resetForm(),hideForm()]}>Cancel</button>
                </div>
            </form>
            {messages}
        </div>
    )

}
export default UserForm;