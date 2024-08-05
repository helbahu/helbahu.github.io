import { useEffect } from 'react';
import './ColorPage.css';
import {useParams,useNavigate} from 'react-router-dom'

const ColorPage = ({colors}) => {
    const navigate = useNavigate();
    const {color} = useParams();
    const colorObj = colors.filter(c=>c.name === color)[0];

    const notAColor = ()=>{
        if(!colorObj) navigate("/colors");
        return;
    }

    useEffect(()=>{
        notAColor();
    },[])

    return (
        <>
            {colorObj &&
                <div className='ColorPage' style={{backgroundColor:colorObj.value}}>
                        <h2>{colorObj.name}</h2>
                        <button onClick={()=>navigate(-1)}>Go Back</button>
                </div>
            }
        </>
    )
}

export default ColorPage;