import { useEffect, useState } from 'react';
import './useErrorMessages.css';

const useErrorMessages = () => {
    const [messages,setMessages] = useState([]);

    useEffect(()=>{
        if(messages.length > 0){
            setTimeout(() => {
                setMessages(messages => []);
            }, 5000);
        }

    },[messages])

    return [(
        <>
            {messages.length > 0 &&
                <div className='ErrorMessage'>
                    <ul>
                        {
                            messages.map((msg,idx) => <li key={idx}>{msg}</li>)
                        }
                    </ul>
                </div>
            }
        </>
    ),setMessages];
}
export default useErrorMessages;