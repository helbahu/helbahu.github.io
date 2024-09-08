import { useNavigate } from "react-router-dom";
import useLocalStorage from "./useLocalStorage";
import JoblyApi from "./JoblyApi";

const useAuthenticate = () => {
    const {getUsername,isAdmin,getToken} = useLocalStorage();
    const navigate = useNavigate();

    const setToken = () => {
        const token = getToken(); 
        if(token){
            JoblyApi.token = token;
        }
    }

    const authenticateUserIsLoggedIn = (callback=null,path='/') => {
        setToken();
        if(!getUsername()){
            navigate(path,{replace:true});
        }else if(callback){
            callback();
        }
    }

    const authenticateUserIsAdmin = (callback) => {
        setToken();
        if(isAdmin()){
            callback();
        }else{
            navigate('/',{replace:true});
        }        
    }


    const authenticateCurrentUserIsAdminOrUser = (username,callback) => {
        setToken();
        if(getUsername() === username){
            navigate('/profile',{replace:true});
        }else if(isAdmin()){
            callback();
        }else{
            navigate('/',{replace:true});
        }
    
        
    }


    return {authenticateUserIsAdmin,authenticateUserIsLoggedIn,authenticateCurrentUserIsAdminOrUser};
}

export default useAuthenticate;