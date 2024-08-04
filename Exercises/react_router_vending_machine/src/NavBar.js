import { NavLink } from 'react-router-dom';
import snacksList from './snacksList';
import './NavBar.css';

function NavBar() {
    const snacks = Object.keys(snacksList);

    return (
    <div className="NavBar">
        <div className='NavBar-List'>
            <NavLink key={0} to='/'>Home</NavLink>
            {snacks.map(snack=> <NavLink key={snack} to={`/snacks/${snack}`}>{snacksList[snack].name}</NavLink>)}
        </div>
    </div>
  );
}

export default NavBar;
