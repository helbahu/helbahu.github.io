import {jwtDecode} from 'jwt-decode';

const useLocalStorage = () => {
    
    const get = (key) => {
        const value = localStorage.getItem(key);
        return value;
    }

    const set = (key,value) => {
        localStorage.setItem(key,value);
    }

    const getUsername = () => {
        const token = getToken();
        const {username} = decodeToken(token);
        return username;
    }

    const isAdmin = () => {
        const token = getToken();
        const {isAdmin} = decodeToken(token);
        return isAdmin;
    }


    const getToken = () => {
        const value = get('joblyToken');
        return value;
    }

    const decodeToken = (token) => {
        try{
            const decodedHeader = jwtDecode(token,{header:true});

            if(decodedHeader.typ === 'JWT'){
                const decoded = jwtDecode(token);
                return decoded;
            }    
        }catch(err){
            console.log(err);
            return {};
        }

    }

    const setToken = (value) => {
        set('joblyToken',value);
    }

    const clear = () => {
        localStorage.removeItem('joblyToken');
    }

    return {getUsername, getToken, setToken,isAdmin,clear};
}

export default useLocalStorage;