import { Link } from "react-router-dom";
import useBoolean from "./useBoolean";
import UserForm from "./UserForm";
import Header from "./Header";
import JoblyApi from "./JoblyApi";
import JobCard from "./JobCard";
import { useEffect, useState } from "react";
import './User.css';
import useLoadingMessage from "./useLoadingMessage";

const UserDetails = ({user,setUser,deleteUser}) => {
    const [LoadingMessage,endLoading] = useLoadingMessage();

    const [isEditing,toggleEditProfile] = useBoolean();
    const [applications,setApplications] = useState([]);


    useEffect(()=>{
        const getApplications = async () => {
            const userApplications = [];
            for(const id of user.applications){
                const job = await JoblyApi.getJob(id);
                userApplications.push(job);
            }
            setApplications(appl=>userApplications);
            endLoading();
        }
        if(user?.applications){
            getApplications();
        }

    },[user]);


    return (
        <>
        {!isEditing ?
            <div className='User'>
                <LoadingMessage>
                    {user &&
                        <>
                            <Header title={`${user.firstName} ${user.lastName}`}
                                    rightComponent={<>
                                                        <button onClick={toggleEditProfile}>Edit</button>
                                                        <button className='User-Delete-Btn' onClick={deleteUser}>Delete</button>
                                                    </>
                                    }
                            />

                            <div>
                                <div>
                                    <h3>Username: {user.username}</h3>
                                    <h3>Email: {user.email}</h3>
                                </div>
                                <h3>Applications</h3>
                                {applications.length > 0 ?
                                    <div className='Applications-List' >
                                        {applications.map(appl => <JobCard key={appl.id} job={appl}/>)}
                                    </div>:
                                    <h4>-- No Applications --</h4>

                                }
                            </div>
                        </>
                    }
                </LoadingMessage>                

            </div>:
            <UserForm setUser={setUser} hideForm={toggleEditProfile} initialState={{username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email}} />
        }
        </>
    )

}
export default UserDetails;