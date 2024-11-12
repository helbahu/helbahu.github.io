import Event from '../models/event.js';
import User from '../models/user.js';
import Booking from '../models/booking.js';

import {_bookingObj} from './resolverHelpers.js'
import { isCorrectUser, isLoggedIn } from './authHelpers.js';


const bookingResolvers = {
    async bookings (_,req) {
        isLoggedIn(req);

        const allBookings = await Booking.find();
        if(allBookings){
            return allBookings.map((booking:any) => _bookingObj(booking))
        }

    },
    async booking (args:{id:string},req) {
        const booking:any = await Booking.findById(args.id);

        isCorrectUser(req,booking.userId);

        if(booking){
            return _bookingObj(booking);
        }

    },
    async bookEvent (args:{eventId:string},req) {
        isLoggedIn(req);

        const event = await Event.findById(args.eventId);
        const user = await User.findById(req.userId);

        if(event && user){
            const newBooking = new Booking({
                eventId: event._id,
                userId: user._id
            })

            await newBooking.save();

            return {message: `"${event.title}" booked for ${user.name}!` };

        }

    },
    async cancelBooking (args:{eventId:string},req) {
        isLoggedIn(req);

        const booking = await Booking.findOne({eventId: args.eventId, userId:req.userId});
        
        if(booking._id){
            await Booking.deleteOne({_id: booking._id});

            return {message: "Booking deleted successfully!"};            
        }else{
            throw new Error(`No Booking was found for this event.`);
        }
        
    },


}

export default bookingResolvers;