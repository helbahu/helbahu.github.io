import './MessageDisplay.css';

import axios from 'axios';
import { useEffect, useState } from 'react';
import {v4 as uuid} from 'uuid';

import {onMessage} from 'firebase/messaging';
import {initializeFCM, messaging} from './notification/firebase';


const MessageDisplay = () => {
  const [isModal, setIsModal] = useState(false);
  const [data, setData] = useState([]);

  const closeModal = () => {
    setData(data=>[]);
    setIsModal(b=>false);
  }


  useEffect(() => {
    const subscribeToken = async () => {
      const token = localStorage.getItem("fcmToken");
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/subscribe-to-topic`,{token});
      console.log("RES   =   ",res.data.message);
    }

    const initializeNotifications = async () => {
      // request notification permission and register the service worker
      await initializeFCM();
      // event handler for incoming messages
      onMessage(messaging, (m) => {
        console.log("MESSAGE SENT!",m);
        const title = m?.data?.title || m?.notification?.title;
        const body = m?.data?.body || m?.notification?.body;
        const icon = m?.data?.icon || m?.notification?.image;
        const badge = m?.data?.badge;

        setData(data => [...data,{title, body}]);
        setIsModal(true);

        new Notification(title || "Notification Title", {
          icon,
          body,
          badge
        });

      });

      await subscribeToken();
      
    }
    try{
      initializeNotifications();
    }catch(err){
      console.log("Failed to initialize FCM Messaging on this device.");
    }
    
  }, []);


  return (
    <div>
        <div className='WebhookListener-Modal' style={{display: !isModal ? 'none':null}}>
            <div className='WebhookListener-Modal-Header'>
                <h1>DATA</h1>
                <button onClick={closeModal}>X</button>
            </div>
            <ul>
                {data.map(msg=>(
                    <li key={uuid()}>
                        <b>{msg.title}</b>
                        <p>{msg.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default MessageDisplay;