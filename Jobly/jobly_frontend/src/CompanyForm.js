import './SignUp.css';
import useForm from './useForm';
import FormInput from './FormInput';
import JoblyApi from './JoblyApi';
import useErrorMessages from './useErrorMessages';
import ExpressError from './expressError';
import useLoadingMessage from './useLoadingMessage';

const CompanyForm = ({hideForm,setCompanies=null,setCompany=null,initialState={}}) => {
    const [LoadingMessage,toggleLoadingState] = useLoadingMessage(false);

    const [messages,setMessages] = useErrorMessages();

    const INITIAL_STATE = {
        name: initialState.name || '',
        handle: '',
        description: initialState.description || '',
        numEmployees: initialState.numEmployees || '',
        logoUrl: initialState.logoUrl || ''
    };

    const addOrUpdateCompany = async(data) => {
        try{
            toggleLoadingState(true);
            if(data.numEmployees < 0 || data.numEmployees%1 !== 0) throw new ExpressError("Number of Employees must be a positive integer.");
            if(data.handle.includes(" ")) throw new ExpressError("The handle cannot contain any spaces.");

            data.numEmployees = Math.round(data.numEmployees);

            if(setCompanies){
                let res = await JoblyApi.addNewcompany(data);
                setCompanies(companies=>[...companies,res]);
            }else if(setCompany){
                delete data.handle;
                let res = await JoblyApi.updateCompany(initialState.handle,data);
                setCompany(company=>({...company,...data}));
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

    const [formData,handleChange,handleSubmit,resetForm] = useForm(INITIAL_STATE,addOrUpdateCompany);

    return (
        <div className='SignUp'>
            <h2>{setCompanies ? "Add New Company":"Update Company"}</h2>
            <form onSubmit={handleSubmit} >
                <FormInput label='Name' name='name' value={formData.name} handleChange={handleChange} />
                {setCompanies &&
                    <FormInput label='Handle' name='handle' value={formData.handle} handleChange={handleChange} max={10}/>            
                }
                <FormInput label='Description' name='description' value={formData.description} handleChange={handleChange} />
                <FormInput label='Number of Employees' name='numEmployees' value={formData.numEmployees} handleChange={handleChange} type='number' min={1} />
                <FormInput label='Logo Url' name='logoUrl' value={formData.logoUrl} handleChange={handleChange} required={false} />
                
                <div>
                    <button><LoadingMessage text >{setCompanies ? "Add Company":"Update Company"}</LoadingMessage></button>
                    <button className='AddProfileForm-Cancel-Btn' type='button' onClick={()=>[resetForm(),hideForm()]}>Cancel</button>
                </div>
            </form>
            {messages}
        </div>
    )


}
export default CompanyForm;