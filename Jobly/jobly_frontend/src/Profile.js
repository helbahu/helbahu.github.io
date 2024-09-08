import { Link, useNavigate, useParams } from 'react-router-dom';
import './Profile.css';
import { useContext, useEffect} from 'react';
import JoblyApi from './JoblyApi';
import UserDetails from './UserDetails';
import UserContext from './UserContext';
import useLocalStorage from './useLocalStorage';
import useAuthenticate from './useAuthenticate';

const Profile = () => {

    const {authenticateUserIsLoggedIn} = useAuthenticate();
    const {clear} = useLocalStorage();
    const {user,setUser} = useContext(UserContext);

    const navigate = useNavigate();

    const deleteUser = async() => {
        try{
            let res = await JoblyApi.deleteUser(user.username);

            clear();
            setUser(user=>({}));        
            navigate('/');
    
        }catch(err){
            console.log(err)    
        }
    }

    useEffect(()=>{
        authenticateUserIsLoggedIn();        
    },[])

    return <UserDetails user={user} setUser={setUser} deleteUser={deleteUser} />

}
export default Profile;