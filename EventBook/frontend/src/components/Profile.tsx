import { useEffect, useState } from 'react';
import './Profile.css';
import { Link, useNavigate } from 'react-router-dom';
import API from '../API';
import { UserObj } from '../Interfaces';
import useLocalStorage from './useLocalStorage';
import EditProfileForm from './EditProfileForm';

interface componentObj {
    postMessage:Function
}
const Profile = ({postMessage}:componentObj) => {
    const [isLoading,setIsLoading] = useState(true);
    const [user,setUser] = useState<UserObj>();
    const navigate = useNavigate();
    const [isEditUserForm,setIsEditUserForm] = useState(false);

    const toggleUserForm = () => {
        setIsEditUserForm(b => !b);
    }


    const formatDate = (date:string) => {
        let dateObj = new Date(date);

        let birthDate = dateObj.toUTCString();
        birthDate = birthDate.split(" 00")[0];

        return birthDate;
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




    useEffect(()=>{
        const userId = useLocalStorage.getUserId();

        const getUser = async() => {
            if(userId){
                const _user = await API.getUser(userId);
                setUser(user=> _user);    
                setIsLoading(false);
            }
        }

        if(!userId){
            navigate("/");
        }else{
            getUser();

        }

    },[])

    return (
        <>{isEditUserForm ? 
            user && <EditProfileForm postMessage={postMessage} setUser={setUser} initialState={user} toggleUserForm={toggleUserForm} />:
            <div className='Profile'>
                {isLoading ?
                    <h2>...Loading</h2>:
                    <>
                        <div className='Profile-Header'>
                            <div>
                                <button className='Edit-Button' onClick={toggleUserForm}>Edit</button>
                            </div>
                            <div>
                                <h2>PROFILE</h2>
                            </div>
                            <div>
                            </div>
                        </div>
                        <div className='Profile-Container'>
                        {
                            user && user.name &&
                            <div>
                                <p><b>Name: </b>{user.name}</p>
                                <p><b>Email Address: </b>{user.email}</p>

                                <p><b>Date of Birth: </b>{formatDate(user.dateOfBirth)}</p>
                                <p><b>Bio: </b>{user.bio}</p>

                                <div className='Profile-Events-Container'>
                                    <div>
                                        <b>Created Events</b>
                                        <ul className='Profile-CreatedEvents-Container'>
                                            {user.createdEvents?.length > 0 ? user.createdEvents.map(event =>(
                                                <Link key={event._id} to={`/events/${event._id}`}>
                                                    <li>
                                                        {event.title}
                                                    </li>
                                                </Link>

                                            )):
                                                <p>-- No events --</p>
                                            }
                                        </ul>
                                    </div>
                                    <div>
                                        <b>Bookings</b>
                                        <ul className='Profile-Bookings-Container'>
                                            {user.bookings?.length > 0 ? user.bookings.map(booking =>(
                                                <Link key={booking._id} to={`/events/${booking.event?._id}`}>
                                                    <li>
                                                        {booking.event.title} <small>(Booked at: {formatDateTime(booking.createdAt)})</small>
                                                    </li>
                                                </Link>
                                            )):
                                                <p>-- No bookings --</p>
                                            }
                                        </ul>
                                    </div>
                                </div>

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

export default Profile;