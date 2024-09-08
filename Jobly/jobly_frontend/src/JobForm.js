import './SignUp.css';
import useForm from './useForm';
import FormInput from './FormInput';
import JoblyApi from './JoblyApi';
import useErrorMessages from './useErrorMessages';
import { useEffect, useState } from 'react';
import ExpressError from './expressError';
import useLoadingMessage from './useLoadingMessage';

const JobForm = ({hideForm,setJobs=null,setJob=null,initialState={}}) => {
    const [LoadingMessage,toggleLoadingState] = useLoadingMessage(false);

    const [messages,setMessages] = useErrorMessages();

    const INITIAL_STATE = {
        title: initialState.title || '',
        companyHandle: '',
        salary: initialState.salary || 0,
        equity: initialState.equity || 0
    };

    const addOrUpdateJob = async(data) => {
        try{
            toggleLoadingState(true);
            if(data.salary < 0) throw new ExpressError("Salary must have a positive value");
            if(data.equity < 0 || data.equity >= 1) throw new ExpressError("Equity must have a positive value between 0 and 1 (not including 1)");

            data.salary = Math.round(data.salary);
            data.equity = `${data.equity}`;

            if(setJobs){
                let res = await JoblyApi.addNewJob(data);
                setJobs(jobs=>[...jobs,res]);
            }else if(setJob){
                delete data.companyHandle;
                let res = await JoblyApi.updateJob(initialState.id,data);
                setJob(job=>({...job,...data}));
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

    const [formData,handleChange,handleSubmit,resetForm] = useForm(INITIAL_STATE,addOrUpdateJob);

    const [companies,setCompanies] = useState([]);

    useEffect(()=>{
        const getCompanies = async() => {
            let res = await JoblyApi.getCompanies();
            setCompanies(companies=>res);
        }
        getCompanies();
    },[])


    return (
        <div className='SignUp'>
            <h2>{setJobs ? "Add New Job":"Update Job"}</h2>
            <form onSubmit={handleSubmit} >
                <FormInput label='Title' name='title' value={formData.title} handleChange={handleChange} />
                {setJobs &&
                    <FormInput label='Company' name='companyHandle' value={formData.companyHandle} handleChange={handleChange} type='select'>
                        <option value=''>-- Select --</option>
                        {companies &&
                            companies.map(company=><option key={company.handle} value={company.handle}>{company.name} ({company.handle})</option>)
                        }                        
                    </FormInput>
                }

                <FormInput label='Salary' name='salary' value={formData.salary} handleChange={handleChange} type='number' min={0} />
                <FormInput label='Equity' name='equity' value={formData.equity} handleChange={handleChange} type='number' min={0} max={0.99} step={0.01}/>
                
                <div>
                    <button><LoadingMessage text >{setJobs ? "Add Job":"Update Job"}</LoadingMessage></button>
                    <button className='AddProfileForm-Cancel-Btn' type='button' onClick={()=>[resetForm(),hideForm()]}>Cancel</button>
                </div>
            </form>
            {messages}
        </div>
    )

}
export default JobForm;