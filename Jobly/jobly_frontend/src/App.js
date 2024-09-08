import './App.css';
import NavBar from './NavBar';
import UserProvider from './UserProvider';
import Routes from './Routes';

function App() {

  return (
    <div className="App">
      <UserProvider>
        <NavBar/>
        <div className='App-Container'>
            <Routes />
        </div>
      </UserProvider>
    </div>
  );
}

export default App;
