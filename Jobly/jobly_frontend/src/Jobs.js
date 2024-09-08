import { useContext, useEffect, useState } from 'react';
import './Jobs.css';
import JoblyApi from './JoblyApi';
import useBoolean from './useBoolean';
import JobForm from './JobForm';
import JobCard from './JobCard';
import FilterForm from './FilterForm';
import Header from './Header';
import UserContext from './UserContext';
import useAuthenticate from './useAuthenticate';
import useLoadingMessage from './useLoadingMessage';

const Jobs = () => {
    const [LoadingMessage,endLoading] = useLoadingMessage();

    const {authenticateUserIsLoggedIn} = useAuthenticate();

    const {user} = useContext(UserContext);
    const {isAdmin} = user;
    
    const [isAddingNewJob,toggleAddJobForm] = useBoolean();

    const [jobs,setJobs] = useState([]);
    
    useEffect(()=>{
        const getJobs = async() => {
            let res = await JoblyApi.getJobs();
            setJobs(jobs=>res);
            endLoading();
        }
        authenticateUserIsLoggedIn(getJobs);        

    },[])

    return (
        <>
            {!isAddingNewJob ? 
            <div className='Jobs'>
                <Header title="Jobs" 
                        leftComponent={<FilterForm setJobs={setJobs}/>}
                        rightComponent={isAdmin && <button onClick={toggleAddJobForm}>Add Job</button>}
                />

                {jobs.length > 0 ?
                    <div className='Jobs-List'>
                        {jobs.map(job=> {
                            return <JobCard key={job.id} job={job}/>
                        })}

                    </div>:
                    <LoadingMessage>
                        <h4>-- No Jobs Found --</h4>
                    </LoadingMessage>
                }

            </div>:
            <JobForm setJobs={setJobs} hideForm={toggleAddJobForm}/>
            }
        </>        
    )

}
export default Jobs;