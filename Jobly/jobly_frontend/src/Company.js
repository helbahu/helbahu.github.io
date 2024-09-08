import { useContext, useEffect, useState } from 'react';
import './Company.css';
import JoblyApi from './JoblyApi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useBoolean from './useBoolean';
import CompanyForm from './CompanyForm';
import JobCard from './JobCard';
import Header from './Header';
import UserContext from './UserContext';
import useAuthenticate from './useAuthenticate';
import useLoadingMessage from './useLoadingMessage';

const Company = () => {
    const [LoadingMessage,endLoading] = useLoadingMessage();
    const {authenticateUserIsLoggedIn} = useAuthenticate();

    const {user} = useContext(UserContext);
    const {isAdmin} = user;

    const navigate = useNavigate();
    const [isEditingCompany,toggleEditCompanyForm] = useBoolean();

    const {handle} = useParams();
    const [company,setCompany] = useState();

    const deleteCompany = async() => {
        try{
            let res = await JoblyApi.deleteCompany(handle);
            setCompany(company=>({}));
            navigate('/companies');
        
        }catch(err){
            console.log(err)    
        }
    }

    useEffect(()=>{
        const getCompany = async() => {
            let res = await JoblyApi.getCompany(handle);
            setCompany(company=>res);            
            endLoading();
        }
        authenticateUserIsLoggedIn(getCompany);

    },[])

    return (
        <>
            {!isEditingCompany ?
                <div className='Company' >
                    <LoadingMessage>
                        {company ? 
                            <>
                                <Header title={company.name} 
                                        rightComponent={isAdmin && 
                                            <>
                                                <button onClick={toggleEditCompanyForm}>Edit</button>
                                                <button className='Company-Delete-Btn' onClick={deleteCompany}>Delete</button>                                            
                                            </>
                                        }        
                                />

                                <div className='Company-Info'>
                                    <div className='Company-Info-Containers'>
                                        <img width='200' src={company.logoUrl} alt={company.name}/>
                                    </div>
                                    <div className='Company-Info-Containers'>
                                        <p>{company.description}</p>
                                        <p>Size: {company.numEmployees} Employees</p>
                                    </div>
                                </div>
                                <h3>Jobs</h3>
                                {company.jobs.length > 0 ?
                                    <div className='Company-Jobs'>
                                            {company.jobs.map(job=> {
                                                return <JobCard key={job.id} job={job}/>                                    
                                            })
                                        }
                                    </div>:
                                    <h4>-- No jobs posted --</h4>
                                }
                            </>:
                            null
                        }
                    </LoadingMessage>
                </div>:
                <CompanyForm hideForm={toggleEditCompanyForm} setCompany={setCompany} initialState={company}/>
        
            }
        </>
    )

}
export default Company;