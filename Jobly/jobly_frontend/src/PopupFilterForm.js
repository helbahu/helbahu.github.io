import ExpressError from './expressError';
import FormInput from './FormInput';
import Header from './Header';
import JoblyApi from './JoblyApi';
import './PopupFilterForm.css';
import useErrorMessages from './useErrorMessages';
import useForm from './useForm';

const PopupFilterForm = ({hideForm,setCompanies=null,setJobs=null}) => {
    const [messages,setMessages] = useErrorMessages();

    const INITIAL_STATE_COMPANIES = {
        minEmployees: "",
        maxEmployees: "",
        name: ''
    };

    const INITIAL_STATE_JOBS = {
        minSalary: '',
        hasEquity: '',
        title: ''
    };

    const INITIAL_STATE = setCompanies ? INITIAL_STATE_COMPANIES : INITIAL_STATE_JOBS;

    const filterCompanies = async(data) => {
        try{
            if(setCompanies){
                if((+data.maxEmployees) < (+data.minEmployees) && data.minEmployees && data.maxEmployees) throw new ExpressError("Maximum Number of Employees must be greater than the minimum.");
                
                let res = await JoblyApi.getCompanies(data);
                setCompanies(companies=>res);
    
            }else if(setJobs){
                let res = await JoblyApi.getJobs(data);
                setJobs(jobs=>res);
            }

            hideForm();
        }catch (err) {
            if(err.message){
                setMessages(messages => [err.message]);
            }else{
                setMessages(messages => err);
            }

        }

    }

    const [formData,handleChange,handleSubmit,resetForm] = useForm(INITIAL_STATE,filterCompanies);


    return (
        <div className='PopupFilterForm'>
            <Header title="Filter"
                    rightComponent={<button className='PopupFilterForm-Cancel-Btn' onClick={()=>[hideForm(),resetForm()]}>X</button>}            
            />

            <form onSubmit={handleSubmit} >
                {setCompanies ?
                    <>
                        <FormInput label='Minimum Employees' name='minEmployees' value={formData.minEmployees} handleChange={handleChange} type='number' min={1} />
                        <FormInput label='Maximum Employees' name='maxEmployees' value={formData.maxEmployees} handleChange={handleChange} type='number' min={2} />
                        <FormInput label='Company Name' name='name' value={formData.name} handleChange={handleChange} required={false}/>  
                    </>:
                    <>
                        <FormInput label='Minimum Salary' name='minSalary' value={formData.minSalary} handleChange={handleChange} type='number'/>
                        <FormInput label='Job Title' name='title' value={formData.title} handleChange={handleChange} required={false} />
                        <FormInput label='Equity' name='hasEquity' value={formData.hasEquity} handleChange={handleChange} type='select'>
                            <option value=''>Any</option>
                            <option value='true'>Yes</option>
                        </FormInput>

                    </>
                }
                <button onClick={()=>console.log(INITIAL_STATE)}>{setCompanies ? "Filter Companies":"Filter Jobs"}</button>                
            </form>
            {messages}

        </div>
    )
}
export default PopupFilterForm;