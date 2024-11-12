import { useEffect, useState } from 'react';
import './Events.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Link, useNavigate } from 'react-router-dom';
import API from '../API';
import { EventObj } from '../Interfaces';

const Events = () => {
    const [isLoading,setIsLoading] = useState(true);
    const [events,setEvents] = useState<EventObj[]>([]);

    const navigate = useNavigate();

    const formatDateTime = (dateTime:string) => {
        let dateObj = new Date(dateTime);

        const options:Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour12: true,
            hour: "2-digit",
            minute: "2-digit"
        };

        let localDate = dateObj.toLocaleString("en-US", options);
        return localDate;
    }

    useEffect(()=>{

        const getEvents = async() => {
            const _events = await API.getEvents();
            if(_events.length > 0){
                setEvents(events=>_events);
                setIsLoading(false);
            }

        }

        getEvents();

    },[])

    return (
        <div className='Events'>
            {isLoading ?
                <h2>...Loading</h2>:
                <>
                    <h2>Events</h2>
                    <div className='Events-Container'>
                        {
                            events.map(event=>(
                                <Link key={event._id} to={`/events/${event._id}`}>
                                    <div className='Events-Event text-white' key={event._id}>
                                        <h3>{event.title}</h3>
                                        <p><b>Where: </b>{event.where}</p>
                                        <p><b>When: </b>{formatDateTime(event.dateTime)}</p>

                                        <p><b>About: </b>{event.description}</p>


                                    </div>
                                </Link>
                            ))
                        }
                    </div>                
                </>
            }

        </div>
    )

}

export default Events;