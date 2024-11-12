import { Link, NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { Dispatch } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import useLocalStorage from "./useLocalStorage";

interface ComponentObj {
    isLoggedIn:boolean,
    setIsLoggedIn: Dispatch<React.SetStateAction<boolean>>
}

const NavBar = ({isLoggedIn,setIsLoggedIn}:ComponentObj) => {
    const navigate = useNavigate();

    const logout = () => {
        useLocalStorage.removeToken();
        useLocalStorage.removeUserId();
        setIsLoggedIn(bool=>false);
        navigate("/");
    }

    const toggleNavBar = () => {
        if(window.innerWidth < 992){
            const btn = document.getElementById("navbar-toggler");
            btn?.click();    
        }
        
    }

    return (
        <div className="NavBar navbar navbar-dark navbar-expand-lg bg-dark">
            <Link to='/' className="NavBar-Brand" >
                <img src={require("../images/EB_Logo.png")} alt="Nothing" width='40px'/>
                <p>
                    EventBook
                </p>
            </Link>
            <div style={{marginRight:'10px'}}>
                <button id="navbar-toggler" className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>
            <div className="NavBar-Links collapse navbar-collapse bg-dark" id="navbarSupportedContent">
                <NavLink onClick={toggleNavBar} to={'/events'}>Events</NavLink>
                { isLoggedIn ?
                    <>
                    <NavLink onClick={toggleNavBar} to={'/events/new'}>Create Event</NavLink>
                    <NavLink  onClick={toggleNavBar} to={'/profile'}>Profile</NavLink>
                    <button onClick={()=> {logout(); toggleNavBar()}}>Logout</button>                    
                    </>:
                    <>
                        <NavLink onClick={toggleNavBar} to={'/signup'}>Sign Up</NavLink>
                        <NavLink onClick={toggleNavBar} to={'/login'}>Login</NavLink>
                    </>
                }

            </div>
        </div>
    )

}

export default NavBar;