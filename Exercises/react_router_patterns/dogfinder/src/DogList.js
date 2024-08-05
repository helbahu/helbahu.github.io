import { Link } from "react-router-dom";
import './DogList.css';

const DogList = ({dogs})=>{

    return (
        <div>
            <ul className="DogList">
                {dogs.map((dog,idx)=> <li key={idx} ><Link to={`/dogs/${dog.name}`}>{dog.name}</Link></li>)}
            </ul>
        </div>
    )

}

export default DogList;