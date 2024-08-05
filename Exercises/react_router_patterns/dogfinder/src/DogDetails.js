import { useParams } from 'react-router-dom';
import './DogDetails.css';

const DogDetails = ({dogs})=>{
    const {name} = useParams();
    const dog = dogs.filter(dog=>dog.name==name)[0];

    return (
        <div className='DogDetails'>
            <div>
                <h2>Dog Details</h2>
                <h3>
                    Name: {dog.name}
                </h3>
                <h3>
                    Age: {dog.age}
                </h3>
                <h3>
                    Facts:
                </h3>
                <ul>
                    {dog.facts.map((fact,idx)=> <li key={idx}>{fact}</li>)}
                </ul>
            </div>
            <div>
                <img src={require(`./images/${dog.src}.jpg`)} alt="Dog Image" width='300px'/>
            </div>
        </div>
    )


}

export default DogDetails;