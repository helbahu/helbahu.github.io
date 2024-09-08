import { useContext, useEffect, useState } from 'react';
import './Users.css';
import JoblyApi from './JoblyApi';
import useBoolean from './useBoolean';
import UserForm from './UserForm';
import UserCared from './UserCard';
import Header from './Header';
import UserContext from './UserContext';
import useAuthenticate from './useAuthenticate';
import useLoadingMessage from './useLoadingMessage';

const Users = () => {
    const [LoadingMessage,endLoading] = useLoadingMessage();

    const {authenticateUserIsAdmin} = useAuthenticate();
    const {user} = useContext(UserContext);

    const [isAddingNewUser,toggleAddProfileForm] = useBoolean();
    const [users,setUsers] = useState([]);


    useEffect(()=>{
        const getAllUsers = async() => {
            let res = await JoblyApi.getUsers();
            setUsers(users=>res);
            endLoading();
        }
        authenticateUserIsAdmin(getAllUsers);

    },[user])

    return (
        <>
            {!isAddingNewUser ?
            <div className='Users'>
                <Header title="Users"
                        rightComponent={<button onClick={toggleAddProfileForm}>Add User</button>}
                />
                <LoadingMessage>
                    <div className='Users-List'>
                        {users.map(user=> {
                            return <UserCared key={user.username} user={user} />                        
                        })}

                    </div>
                </LoadingMessage>

            </div>:
            <UserForm setUsers={setUsers} hideForm={toggleAddProfileForm}/>        
            }
        </>
    )

}
export default Users;