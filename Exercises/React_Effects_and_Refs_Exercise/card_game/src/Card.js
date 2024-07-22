import { useEffect, useState } from 'react';
import './Card.css'

const Card = ({image}) => {
    const [randomAngle,setRandomAngle] = useState()

    useEffect(()=>{
        setRandomAngle(Math.floor(Math.random()*101 -50));
    },[])

    return (
        <div className='Card'>
            {image ? 
                <img style={{transform:`rotate(${randomAngle}deg)`}} src={image} alt='card image '/>:
                <img src='https://clipart-library.com/new_gallery/222662_playing-card-png.png' alt='card image '/>
            }
        </div>
        
    )

}
export default Card;