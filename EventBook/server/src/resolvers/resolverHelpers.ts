import Event from '../models/event.js';
import User from '../models/user.js';
import Booking from '../models/booking.js';

import { EventInterface , UserInterface, BookingInterface } from './interfaces.js';

const _eventObj = (event:EventInterface) => {
    return {
        ...event._doc,
        dateTime: event.dateTime.toISOString(),
        createdBy: _user.bind(this, event.createdBy),
        bookings: _eventBookings.bind(this,event._id)

    };

}

const _userObj = (user:UserInterface) => {
    return {
        ...user._doc, 
        dateOfBirth: user.dateOfBirth.toISOString(), 
        createdEvents: _events.bind(this,user._id),
        bookings: _userBookings.bind(this,user._id)
    };
}

const _bookingObj = (booking:BookingInterface) => {
    return {
        _id:booking._id, 
        user: _user.bind(this, booking.userId), 
        event: _event.bind(this, booking.eventId),
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString()

    };       
}

const _events = async (userId:string) => {
    const events = await Event.find({createdBy: userId});
    if(events){
        return events.map((event:any) => _eventObj(event));
    }else{
        throw new Error(`No Events found with given ids.`);
    }

} 

const _event = async (eventId: string) => {
    const event:any = await Event.findById(eventId);
    if(event){
        return _eventObj(event);
    }else{
        throw new Error(`No Event found with id: ${eventId}.`);
    }

} 


const _user = async (id:string) => {
    const user:UserInterface = await User.findById(id);
    if(user){
        return _userObj(user);
    }else{
        throw new Error(`No user with id: "${id}" exists.`);
    }
};

const _userBookings = async (userId:string) => {
    const bookings = await Booking.find({userId:userId});
    if(bookings){
        return bookings.map((booking:any) => _bookingObj(booking));
    }else{
        throw new Error(`No bookings found.`);
    }
};

const _eventBookings = async (eventId:string) => {
    const bookings = await Booking.find({eventId:eventId});
    if(bookings){
        return bookings.map((booking:any) => _bookingObj(booking));
    }else{
        throw new Error(`No bookings found.`);
    }
};

export {_bookingObj,_eventObj,_userObj,_userBookings,_eventBookings,_events,_event,_user}