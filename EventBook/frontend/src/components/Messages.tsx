import { Dispatch, useEffect } from 'react';
import './Messages.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {v4 as uuid} from 'uuid';


interface MessagesObj {
    message: string;
    type: string;
};
interface ComponentObj {
    messages: MessagesObj[],
    setMessages: Dispatch<React.SetStateAction<MessagesObj[]>>
}

const Messages = ({messages,setMessages}:ComponentObj) => {

    useEffect(()=>{
        if(messages.length > 0){
            setTimeout(() => {
                const updatedMessages = [...messages];
                updatedMessages.shift();
                setMessages(m=>updatedMessages); 
            }, 10000);    
        }

    },[messages]);


    return (
        <>
            {messages.length > 0 &&
                <ul className='Messages'>
                    {
                        messages.map(message => (
                            <li key={uuid()} className={`alert bg-${message.type} text-white`} >{message.message}</li>
                        ))
                    }
                </ul>
            }
        
        </>

    )

}

export default Messages;