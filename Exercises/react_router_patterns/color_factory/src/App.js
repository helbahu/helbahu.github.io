import { useEffect, useState } from 'react';
import './App.css';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import {v4 as uuid } from 'uuid';
import ColorsFactory from './ColorsFactory';
import ColorPage from './ColorPage';
import ColorForm from './ColorForm';

function App() {
  const [colors,setColors] = useState([]);

  useEffect(()=>{
    if(localStorage.getItem("colorsList")){
      const colorsObj = JSON.parse(localStorage.getItem("colorsList"));
      console.log(colorsObj);
      setColors(colors=>colorsObj);
    }
  },[])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/colors/new' element={<ColorForm addColor={setColors}/>} />
          <Route path='/colors/:color' element={<ColorPage colors={colors}/>} />
          <Route path='/colors' element={<ColorsFactory colors={colors} />} />
          <Route path='*' element={<Navigate to='/colors'/>} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
