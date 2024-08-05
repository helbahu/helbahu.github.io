import './App.css';
import { BrowserRouter,Navigate,Route,Routes } from 'react-router-dom'
import { useEffect, useState } from 'react';
import DogList from './DogList';
import DogDetails from './DogDetails';

function App({dogs}) {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/dogs' element={<DogList dogs={dogs}/>} />
          <Route path='/dogs/:name' element={<DogDetails dogs={dogs}/>} />
          <Route path='*' element={<Navigate to='/dogs'/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
