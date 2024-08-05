import { Link } from 'react-router-dom';
import './ColorsFactory.css';

const ColorsFactory = ({colors})=>{

    return(
        <div className='ColorsFactory'>
            <div className='ColorsFactory-Heading'>
                <h2>Welcome to the Color Factory.</h2>
                <Link to='/colors/new'>Add A Color</Link>
            </div>
            <div  className='ColorsFactory-List'>
                <h2>Please Select A Color.</h2>
                <div>
                    {colors.map(color=> <div key={color.id}><Link to={`/colors/${color.name}`}>{color.name}</Link></div>)}
                </div>
            </div>
        </div>
    )

}

export default ColorsFactory;