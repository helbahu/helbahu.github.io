import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {

    return (
        <div className="HomePage">
            <div className='HomePage-Title'>
                <h2>Welcome to EventBook</h2>
            </div>
            <div className='HomePage-Intro'>
                Browse events, and sign up to book events you are interested in, and create your own events. Note that it is important to ensure events you plan to attend are in public places and at reasonable times. We do our best to detect any malicious activity, however, you must be aware of the risks.
            </div>
            <div className='HomePage-Btns'>
                <p>Get started by signing up! <Link to={'/signup'}>Sign Up</Link></p>
                <p>Already have an account? <Link to={'/login'}>Login</Link></p>
            </div>

        </div>
    )

}

export default HomePage;