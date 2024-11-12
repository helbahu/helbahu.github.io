import './App.css';

import {Routes,Route, Navigate,} from 'react-router-dom';
import { useEffect, useState } from 'react';

import HomePage from './components/HomePage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Events from './components/Events';
import EventDetails from './components/EventDetails';
import NewEvent from './components/EventForm';
import Messages from './components/Messages';
import useLocalStorage from './components/useLocalStorage';

function App() {
  const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false);
  const [messages,setMessages] = useState<{message:string,type:string}[]>([]);

  const postMessage = (message:string,type="success") => {
    setMessages(m=>([...m,{message,type}]));
  }

  useEffect (()=>{
    const token = useLocalStorage.getToken();

    if(token){
      setIsLoggedIn(bool=>true);
    }

  },[])

  return (
    <div className="App">
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Messages messages={messages} setMessages={setMessages} />
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/login' element={<Login postMessage={postMessage} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/signup' element={<SignUp postMessage={postMessage} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/events/new' element={<NewEvent postMessage={postMessage} />} />
        <Route path='/events/:id' element={<EventDetails postMessage={postMessage} isLoggedIn={isLoggedIn} />} />
        <Route path='/events' element={<Events />} />
        <Route path='/profile' element={<Profile postMessage={postMessage} />} />

        <Route path="*" element={<Navigate to={'/'}/>} />

      </Routes>
      
    </div>
  );
}

export default App;
