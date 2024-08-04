import { Link, useParams } from 'react-router-dom';
import './Snack.css';
import snacksList from './snacksList';

function Snack() {
  const {snackName} = useParams();
  const {name,image} = snacksList[snackName];
  return (
        <div className="Snack">
            <h2>{name}</h2>
            <img src={image} alt={name}/>
        </div>
  );
}

export default Snack;
