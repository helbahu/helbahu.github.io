import React, { useEffect, useState } from 'react';
import './EventDetails.css';
import { Link, Params, useNavigate, useParams } from 'react-router-dom';
import API from '../API';
import Events from './Events';
import EventForm from './EventForm';
import { EventDetailsObj } from '../Interfaces';
import useLocalStorage from './useLocalStorage';

interface ComponentObj {
    isLoggedIn: boolean,
    postMessage: Function
}

const EventDetails = ({isLoggedIn,postMessage}:ComponentObj) => {
    const [isLoading,setIsLoading] = useState(true);

    const userId = useLocalStorage.getUserId();

    const [isEventForm,setIsEventForm] = useState(false);
    const [event,setEvent] = useState<EventDetailsObj>();

    const {id}:Readonly<Params<string>> = useParams();
    const navigate = useNavigate();

    const toggleEventForm = () => {
        setIsEventForm(b => !b);
    }

    const formatHosts = (hosts:{name:string}[]) => {
        let str = ""
        if(hosts.length > 2){
            for(let i = 0; i < hosts.length; i++){
                i !== hosts.length -1 ? str += `${hosts[i].name}, ` : str += `& ${hosts[i].name}.`;
            }
        }else if(hosts.length === 2){
            str = `${hosts[0].name} & ${hosts[1].name}.`;
        }else if(hosts.length === 1){
            str = hosts[0].name;
        }

        return str;        
    }

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

        let localDate = dateObj.toLocaleString("en-US",options);

        return localDate;
    }

    const bookEvent = async() => {
        if(!event || !id) return;
        const booking = await API.bookEvent(id);
        postMessage(`Successfully booked "${event.title}"!`);
        navigate("/profile");
    }

    const cancelBooking = async() => {
        if(!event || !id) return;
        const res = await API.cancelBooking(id);
        postMessage(`Successfully cancelled the booking for "${event.title}"!`);
        navigate("/profile");
    }

    const deleteEvent = async() => {
        if(!event || !id) return;
        const message = await API.deleteEvent(id);
        postMessage(message);
        navigate("/profile");
    }


    useEffect(()=>{

        const getEvent = async() => {
            if(!id) return;
            const _event = await API.getEvent(id);
            setEvent(event=>_event);
            setIsLoading(false)
        }

        getEvent();

    },[id])

    const updateEventData = (data:EventDetailsObj) => {
        setEvent(event => data);
        toggleEventForm();
    }

    return (
        <>{isEventForm ?
            <EventForm postMessage={postMessage} initialState={event} updateEventData={updateEventData}/>:
            <div className='EventDetails'>
                {isLoading ?
                    <h2>...Loading</h2>:
                    event && 
                    <>
                        <div className='EventDetails-Header'>
                            <div>
                                {event.createdBy?._id === userId &&
                                    <button className='Edit-Button' onClick={toggleEventForm}>Edit</button>
                                }
                            </div>
                            <div>
                                <h2>{event.title}</h2>
                            </div>
                            <div>
                                {event.createdBy?._id === userId &&
                                    <button className='Delete-Button' onClick={deleteEvent}>Delete</button>
                                }
                            </div>
                        </div>

                        <div className='EventDetails-Container1'>
                            <p><b>Where: </b>{event.where}</p>
                            <p><b>When: </b>{formatDateTime(event.dateTime)}</p>
                            <p><b>Hosts: </b>{event.hosts ? formatHosts(event.hosts): "Not available"}</p>
                            <p><b>About: </b>{event.description}</p>

                            <div className='EventDetails-Container2'>
                                <div className='EventDetails-CreatedBy'>
                                    {event.createdBy &&
                                        <>
                                            <div>
                                                <b>Event Created By </b>
                                                <p><b>Name: </b>{event.createdBy?.name}</p>
                                                <p><b>Bio: </b>{event.createdBy?.bio}</p>                            
                                            </div>
                                            <div>
                                                <b>Other Events Created By {event.createdBy?.name}</b>
                                                <ul className='EventDetails-Events-Container'>
                                                    {event.createdBy.createdEvents?.length > 1 ? event.createdBy.createdEvents.map(event =>(
                                                        <React.Fragment key={event._id}>
                                                            {event._id !== id &&
                                                                <Link to={`/events/${event._id}`}>
                                                                    <li key={event._id}>
                                                                        {event.title}
                                                                    </li>
                                                                </Link>
                                                            }
                                                        </React.Fragment>
                                                    )):
                                                        <p>-- No events --</p>
                                                    }
                                                </ul>                        
                                            </div>
                                        </>
                                    }
                                </div>

                                {event.createdBy?._id === userId &&
                                    <>
                                        <b>Attendees ({event.bookings?.length}/{event.maxNumberOfAttendees})</b>
                                        <ul>
                                            {event.bookings && event.bookings.map(b =>(
                                                <li key={b._id}>
                                                    {b.user.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </>

                                }


                            </div>

                            {event.createdBy?._id !== userId &&
                                <div>
                                    {isLoggedIn ?
                                        <> 
                                        {event.bookings && event.bookings.findIndex(b => b.user._id === userId) > -1 ?
                                            <button className='EventDetails-CancelEventButton' onClick={cancelBooking}>Cancel Booking</button>:
                                            <>
                                                {event.bookings?.length < event.maxNumberOfAttendees ? 
                                                    <button className='EventDetails-BookEventButton' onClick={bookEvent}>Book Event</button>:
                                                    <p>Event is fully booked!</p>
                                                }
                                            </>
                                            
                                        }
                                        </>:
                                        <p>Sign Up or Login to Book this event.</p>
                                    }

                                </div>
                            }
                            
                        </div>
                    
                    
                    
                    </>
                }

            </div>
        }
        </>
    )

}

export default EventDetails;