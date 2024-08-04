import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import VendingMachine from './VendingMachine';
import Snack from './Snack';
import NavBar from './NavBar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path='/' element={<VendingMachine/>} />
          <Route path='/snacks/:snackName' element={<Snack/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
