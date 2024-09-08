import './HomePage.css';
import useLocalStorage from './useLocalStorage';

const HomePage = () => {
    const { getUsername } = useLocalStorage();
    const username = getUsername();

    return (
        <div className='HomePage'>
            <h2>Welcome{username ? ` ${username}`:``}!</h2>
            <h3>Your job searching journey starts here!</h3>
        </div>
    )

}

export default HomePage;