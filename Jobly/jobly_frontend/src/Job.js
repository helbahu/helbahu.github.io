import { useContext, useEffect, useState } from 'react';
import './Job.css';
import JoblyApi from './JoblyApi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useErrorMessages from './useErrorMessages';
import JobForm from './JobForm';
import useBoolean from './useBoolean';
import CompanyCard from './CompanyCard';
import Header from './Header';
import UserContext from './UserContext';
import useAuthenticate from './useAuthenticate';
import useLoadingMessage from './useLoadingMessage';

const Job = () => {
    const [LoadingMessage,endLoading] = useLoadingMessage();

    const {authenticateUserIsLoggedIn} = useAuthenticate();

    const {user,setUser} = useContext(UserContext);
    const {isAdmin,username} = user;
    const [applied,setApplied] = useState(false);

    const navigate = useNavigate();
    const [isEditingJob,toggleEditJobForm] = useBoolean();

    const {id} = useParams();
    const [job,setJob] = useState();
    const [messages,setMessages] = useErrorMessages();

    const deleteJob = async() => {
        try{
            let res = await JoblyApi.deleteJob(id);
            setJob(job=>({}));
            navigate('/jobs');
        
        }catch(err){
            console.log(err)    
        }
    }

    const apply = async() => {
        if(username){
            try{
                const applied = await JoblyApi.apply(username,id);
                setUser(user=>{
                    const applicationArr = [...user.applications,id];
                    return {...user,applications: applicationArr};
                })
                console.log("Applied",username,id);
                setApplied(bool=>true);
            }catch(err){
                if(err[0].includes('duplicate')){
                    setMessages(messages=>["Duplicate. User has already applied to this job."]);
                }
            }

        }
    }


    useEffect(()=>{
        const getJob = async() => {
            let res = await JoblyApi.getJob(id);
            setJob(job=>res);
            endLoading();
        }
        authenticateUserIsLoggedIn(getJob);

    },[])

    return (
        <>
            {
                !isEditingJob ?
                    <div className='Job'>
                        <LoadingMessage>
                            {job ? 
                                <>
                                    <Header title={job.title}
                                            rightComponent={isAdmin &&
                                                <>
                                                    <button onClick={toggleEditJobForm}>Edit</button>
                                                    <button className='Job-Delete-Btn' onClick={deleteJob}>Delete</button>                                            
                                                </>                                        
                                            }
                                    />

                                    <p>Salary: {job.salary || 'N/A'}</p>
                                    <p>Equity: {job.equity || 'N/A'}</p>
                                    <CompanyCard company={job.company}/>

                                    {username && (user && user.applications.includes(job.id) || applied ? 
                                            <h3>{username} has applied to this job.</h3>:
                                            <h3>Interested in this position ? <button onClick={apply}>Apply</button> </h3>
                                    )}

                                </>:
                                null        
                            }
                        </LoadingMessage>                        
                        {messages}
                    </div>:
                    <JobForm hideForm={toggleEditJobForm} setJob={setJob} initialState={job}/>
            }
        </>
    )

}
export default Job;