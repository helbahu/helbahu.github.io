import { Link } from 'react-router-dom';
import snacksList from './snacksList';
import './VendingMachine.css';

function VendingMachine() {
    const snacks = Object.keys(snacksList);

    return (
    <div className="VendingMachine">
        <div className='VendingMachine-Image'>
        </div>
        <ul className='VendingMachine-List'>
            {snacks.map(snack=><li key={snack} > <Link to={`/snacks/${snack}`}>{snacksList[snack].name}</Link>  </li>)}
        </ul>
    </div>
  );
}

export default VendingMachine;
