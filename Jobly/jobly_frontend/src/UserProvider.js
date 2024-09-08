import React, {useState,useEffect} from "react";
import UserContext from "./UserContext";
import JoblyApi from "./JoblyApi";
import useLocalStorage from "./useLocalStorage";

const UserProvider = ({children}) => {
    const {getUsername,getToken} = useLocalStorage();
    const [user,setUser] = useState({});

    const getUser = async(username)=>{
        try{
          const currentUser = await JoblyApi.getUser(username);
          setUser(currentUser);   
        }catch(err){
          console.log(err);
        }    
    }

    useEffect(()=>{
        const token = getToken();
        if(token){
          JoblyApi.token = token;
          const username = getUsername();
          getUser(username);
        }

    },[])
        

    return (
        <UserContext.Provider value={{user,getUser,setUser}}>
            {children}
        </UserContext.Provider>
    )

}
export default UserProvider;