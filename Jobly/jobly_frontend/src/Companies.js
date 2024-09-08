import { useContext, useEffect, useState } from 'react';
import './Companies.css';
import JoblyApi from './JoblyApi';
import useBoolean from './useBoolean';
import CompanyForm from './CompanyForm';
import CompanyCard from './CompanyCard';
import FilterForm from './FilterForm';
import Header from './Header';
import UserContext from './UserContext';
import useAuthenticate from './useAuthenticate';
import useLoadingMessage from './useLoadingMessage';

const Companies = () => {
    const [LoadingMessage,endLoading] = useLoadingMessage();

    const {authenticateUserIsLoggedIn} = useAuthenticate();

    const {user} = useContext(UserContext);
    const isAdmin = user.isAdmin;

    const [isAddingNewCompany,toggleAddCompanyForm] = useBoolean();
    const [companies,setCompanies] = useState([]);

    useEffect(()=>{
        const getCompanies = async() => {
            let res = await JoblyApi.getCompanies();
            setCompanies(companies=>res);
            endLoading();
        }
        authenticateUserIsLoggedIn(getCompanies);        

    },[])


    return (
        <>
            {!isAddingNewCompany ?
                <div className='Companies'>
                    <Header title="Companies" 
                            leftComponent={<FilterForm setCompanies={setCompanies}/>}
                            rightComponent={isAdmin && <button onClick={toggleAddCompanyForm}>Add Company</button>}
                    />

                    {companies.length > 0 ?
                        <div className='Companies-List'>
                            {companies.map(company=> {
                                return <CompanyCard key={company.handle} company={company}/>
                            })}
                        </div>:
                        <LoadingMessage>
                            <h4>-- No Companies Found --</h4>
                        </LoadingMessage>
                    }

                </div>:
                <CompanyForm setCompanies={setCompanies} hideForm={toggleAddCompanyForm}/>
        
            }
        </>
    )

}
export default Companies;