import { Link, useNavigate, useParams } from 'react-router-dom';
import './User.css';
import { useContext, useEffect, useState } from 'react';
import JoblyApi from './JoblyApi';
import UserDetails from './UserDetails';
import UserContext from './UserContext';
import useAuthenticate from './useAuthenticate';

const User = () => {
    const {authenticateCurrentUserIsAdminOrUser} = useAuthenticate();
    const {user:currentUser} = useContext(UserContext);
    
    const [user,setUser] = useState();
    const {username} = useParams();
    const navigate = useNavigate();

    const deleteUser = async() => {
        try{
            let res = await JoblyApi.deleteUser(username);        
            navigate('/users');    
        }catch(err){
            console.log(err)    
        }
    }

    useEffect(()=>{
        const getUser = async()=>{
            try{
                const user = await JoblyApi.getUser(username);
                setUser(u=>user);
            }catch(err){
                if(err[0] === 'Unauthorized'){
                    navigate('/',{replace:true});
                }
            }
        }
        authenticateCurrentUserIsAdminOrUser(username,getUser); 

    },[currentUser])

    return <UserDetails user={user} setUser={setUser} deleteUser={deleteUser} />

}
export default User;