import './EventForm.css';
import './Form.css';

import FormInput from './FormInput';
import useForm from './useForm';
import API from '../API';
import {useNavigate} from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { CreateEventFormInput, CreateEventInput, Host, UpdateEventInput } from '../Interfaces';
import useLocalStorage from './useLocalStorage';

interface ComponentObj {
    postMessage:Function,
    initialState?:any,
    updateEventData?:Function
}

const EventForm = ({postMessage,initialState,updateEventData=(()=>{})}:ComponentObj) => {
    const [isLoadingButton,setIsLoadingButton] = useState(false);
    const userId = useLocalStorage.getUserId();

    const navigate = useNavigate();
    
    let INITIAL_STATE = useRef({title: '', description: '', price:0, dateTime: '', where: '', maxNumberOfAttendees:0, host: '',isHost:true});

    const [hosts,setHosts] = useState<Host[]>([]);
    let hostsArr = useRef([]);

    const formatDateTime = (dateTime:string) => {
        let dateObj = new Date(dateTime);
        
        const optionsTime:Intl.DateTimeFormatOptions = {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit"
        };

        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        let localTime = dateObj.toLocaleString("en-US",optionsTime);

        return `${year}-${month < 10 ? `0${month}`:month}-${day < 10 ? `0${day}`:day}T${localTime}`;
    }



    const addNewEvent = async(data:CreateEventFormInput) => {
        delete data.host;
        const hostsList:string[] = [...hosts.map(host=>host._id)];
        if(data.isHost && userId){
            hostsList.push(userId);
        }
        delete data.isHost;

        data.hosts = hostsList;
        setHosts(hosts => []);

        data.price = +data.price;
        data.maxNumberOfAttendees = +data.maxNumberOfAttendees;

        const newDate = new Date(data.dateTime);
        data.dateTime = newDate.toISOString();

        const newEventTitle = await API.createEvent(data);
        postMessage(`The event "${newEventTitle}" has been added successfully.`);
        navigate("/profile");

    }

    const updateEvent = async(data:UpdateEventInput) => {
        const updateObj:UpdateEventInput = {};
        if(data.title !== INITIAL_STATE.current.title) updateObj.title = data.title;
        if(data.description !== INITIAL_STATE.current.description) updateObj.description = data.description;
        if(data.where !== INITIAL_STATE.current.where) updateObj.where = data.where;
        if(data.dateTime && data.dateTime !== INITIAL_STATE.current.dateTime){
            const newDate = new Date(data.dateTime);
            updateObj.dateTime = newDate.toISOString();
        } 

        if(data.price && +data.price !== +INITIAL_STATE.current.price) updateObj.price = +data.price;
        if(data.maxNumberOfAttendees && +data.maxNumberOfAttendees !== +INITIAL_STATE.current.maxNumberOfAttendees) updateObj.maxNumberOfAttendees = +data.maxNumberOfAttendees;

        if(hosts !== hostsArr.current || data.isHost !== INITIAL_STATE.current.isHost){
            const hostsList = [...hosts.map(host=>host._id)];
            if(data.isHost && userId){
                hostsList.push(userId);
            }
            updateObj.hosts = hostsList;
            
        }

        const res = await API.updateEvent(initialState._id,updateObj);
        postMessage(`The event "${res.title}" has been updated successfully.`);
        updateEventData(res);

    };


    const addorUpdateEvent = async(data:any) => {
        setIsLoadingButton(b=>true);
        if(initialState){
            await updateEvent(data);
        }else{
            await addNewEvent(data);
        }
        setIsLoadingButton(b=>false);

    }
    
    const [formData,handleChange,handleSubmit,,setFormData] = useForm(INITIAL_STATE.current,addorUpdateEvent);


    useEffect(()=>{
        if(!userId){
            navigate("/");
        }else{
            if(initialState){
                INITIAL_STATE.current = {...initialState, host: '', dateTime:formatDateTime(initialState.dateTime)};

                if(initialState.hosts){
                    hostsArr.current = initialState.hosts.filter((host:{_id:string}) => {
                        host._id === userId ? INITIAL_STATE.current.isHost = true : INITIAL_STATE.current.isHost = false;
                        return host._id !== userId;
                    })  
                    setHosts(hosts => hostsArr.current);
                }
        
                setFormData((data:any) => INITIAL_STATE.current);
                
            }
        


        }

    },[])






    const handleIsHostCheckbox = ()=>{
        setFormData((data:any)=>({...data,isHost: !data.isHost}));
    }

    const addHost = async() => {
        if(formData.host){
            try {
                const res = await API.getUserByEmail(formData.host);
                setHosts(hosts => [...hosts,{name: res.name, _id:res._id}]);
            }catch(err){
                postMessage("No user exists with this email address.","error")
            }
            setFormData((data:any) => ({...data, host:''}));    

        }
    }
    
    const removeHost = (id:string) => {
        const hostArr = hosts.filter(h => h._id !== id);
        setHosts(hosts => hostArr);

    }


    
    return(
        <div className='Form'>
            <h2 className='Form-Title' >{initialState ? 'Update Event':'Create Event'}</h2>
            <form onSubmit={handleSubmit} >
                <FormInput label='Title' name='title' value={formData.title} handleChange={handleChange} />
                <FormInput label='Description' name='description' value={formData.description} handleChange={handleChange} type='textarea' />

                <FormInput label='Where' name='where' value={formData.where} handleChange={handleChange} />

                <FormInput label='When' name='dateTime' value={formData.dateTime} handleChange={handleChange} type='datetime-local' />
                <div>
                    <div className="FormInput-Label">
                        <label htmlFor='host'>Hosts</label>
                    </div>
                    <FormInput name='isHost' type='checkbox' checkboxQuestion='Are you a host?'value={initialState ? (initialState.hosts.findIndex((host:{_id:string})=>host._id === userId) >= 0): true} handleChange={handleIsHostCheckbox}/>

                    <div className='NewEvent-AddHost'>
                        <input className='FormInput-Input' id='host' name='host' placeholder='Host email address' value={formData.host ? formData.host: ""} onChange={handleChange}/>
                        <button onClick={addHost} type='button'>Add Host</button>
                    </div>
                    {hosts.length > 0 &&
                        <div className='NewEvent-Hosts'>
                            {hosts.map(host => <div key={host._id}><span>{host.name}</span> <button onClick={() => removeHost(host._id)} type='button'>X</button></div>)}
                        </div>
                    }
                </div>

                <FormInput label='Max number of attendees' name='maxNumberOfAttendees' value={formData.maxNumberOfAttendees} handleChange={handleChange} type='number' min={0} />
                <FormInput label='Price' name='price' value={formData.price} handleChange={handleChange} type='number' min={0} />

                <button disabled={isLoadingButton} className='Form-Button'>{isLoadingButton ? "...Loading" : (initialState ? 'Update':'Add')}</button>
            </form>
        </div>
    )

    
}

export default EventForm;