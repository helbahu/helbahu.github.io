import Event from '../models/event.js';

import { EventInterface , EventInput, UpdateEventInput } from './interfaces.js';

import {_eventObj} from './resolverHelpers.js'
import { isCorrectUser, isLoggedIn } from './authHelpers.js';



const eventResolvers = {
    async events() {
        const allEvents:EventInterface[] = await Event.find();
        const allEventsObj = allEvents.map((event) => _eventObj(event));
        return allEventsObj;

    },
    async event (args:{id:string}) {
        const evt:any = await Event.findById(args.id).populate('hosts');
        if(evt){
            return _eventObj(evt);
        }else{
            throw new Error(`No Event found with id: ${args.id}.`);
        }
    },
    async createEvent(args:EventInput,req) {
        isLoggedIn(req);

        const event:any = new Event({
            ...args.event,
            dateTime: new Date(args.event.dateTime),
            createdBy: req.userId
        });

        await event.save();

        const eventObj = {...event._doc, dateTime: event.dateTime.toISOString()}

        return eventObj;
    },
    async updateEvent(args:UpdateEventInput,req) {
        const event = await Event.findById(args.eventId);

        if(event._id){
            isCorrectUser(req,event.createdBy);

            if(args.event.dateTime){
                const res = await Event.updateOne({_id: args.eventId},{...args.event,dateTime: new Date(args.event.dateTime)});
            }else{
                const res = await Event.updateOne({_id: args.eventId},{...args.event});
            }
            let updatedEvent:any = await Event.findById(args.eventId).populate('hosts');;

            return _eventObj(updatedEvent);
        }else{
            throw new Error(`No Event found with id: ${args.eventId}.`);
        }


    },

    async deleteEvent (args:{id:string},req) {
        const event = await Event.findById(args.id);
        
        isCorrectUser(req,event.createdBy);

        await Event.deleteOne({_id: args.id});

        return {message: "Event deleted successfully!"};
    },


}

export default eventResolvers;