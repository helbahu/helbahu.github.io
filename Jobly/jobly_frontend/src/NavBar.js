import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

import { NavLink } from 'react-router-dom';
import './NavBar.css';
import Logout from './Logout'
import { useContext, useState } from 'react';
import UserContext from './UserContext';

const NavBar = () => {
    const [expanded,setExpanded] = useState(false);
    const {user,setUser} = useContext(UserContext);
    const {isAdmin,username} = user;

    const toggleExpanded = () => {
        setExpanded(bool=>!bool);
    }

    return (
        // <div className='NavBar' >
            // <div>
            //     <NavLink to='/'>Jobly</NavLink>
            // </div>
            // <div>
            //     {isAdmin && <NavLink to='/users'>Users</NavLink>}

            //     {
            //         username ?
            //         <>
            //             <NavLink to='/jobs'>Jobs</NavLink>
            //             <NavLink to='/companies'>Companies</NavLink>
            //             <NavLink to={`/profile`}>Profile ({username})</NavLink>
            //             <Logout setUser={setUser} />

            //         </>:
            //         <>
            //             <NavLink to='/login'>Login</NavLink>
            //             <NavLink to='/signup'>Sign Up</NavLink>                    
            //         </>

            //     }
            // </div>
        // </div>

    <div className='NavBar' >
    <Navbar expand="lg" expanded={expanded} className="bs-navbar-collapse">
        <Container> 
            <NavLink className="NavBar-Brand" to='/' onClick={()=>setExpanded(bool=>false)}>Jobly</NavLink>
            {/* <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand> */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleExpanded}/>
            <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
            <Nav>
                {isAdmin && <NavLink onClick={toggleExpanded} to='/users'>Users</NavLink>}

                {
                    username ?
                    <>
                        <NavLink onClick={toggleExpanded} to='/jobs'>Jobs</NavLink>
                        <NavLink onClick={toggleExpanded} to='/companies'>Companies</NavLink>
                        <NavLink onClick={toggleExpanded} to={`/profile`}>Profile ({username})</NavLink>
                        <Logout setUser={setUser} closeNav={()=>setExpanded(bool=>false)} />

                    </>:
                    <>
                        <NavLink onClick={toggleExpanded} to='/login'>Login</NavLink>
                        <NavLink onClick={toggleExpanded} to='/signup'>Sign Up</NavLink>                    
                    </>

                }

            </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    </div>

    )
}
export default NavBar;