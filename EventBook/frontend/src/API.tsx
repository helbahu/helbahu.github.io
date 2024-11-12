import axios from "axios";
import { UserRegisterInput, LoginInput, CreateEventInput, UpdateEventInput,EditUserInput } from "./Interfaces";
import useLocalStorage from '../src/components/useLocalStorage'

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

class API {
  // the token for interactive with the API will be stored here.
  static token = useLocalStorage.getToken();

  static graphqlOptions (query:string,variables={}) {
    const options = {
        method: 'POST',
        url: `${BASE_URL}/graphql`,
        headers: {
            Authorization: `Bearer ${API.token}`,            
            'content-type': 'application/json',
        },
        data: {
            query: query,
            variables: variables
        }
    };

    return options;
  }

  // Register
  static async register(user:UserRegisterInput) {

    let options = this.graphqlOptions(`
        mutation register($user: UserRegisterInput! ) {
            register(user:$user) {
                token
                user {
                    _id
                }
            }
        }`,
        {
            user
        }
    );

    const res = await axios.request(options)
    
    return res.data.data.register;

  }

// UPDATE USER       updateUser(user: EditUserInput!, userId:ID!): User!
static async updateUser(userId:string,user:EditUserInput) {

    let options = this.graphqlOptions(`
        mutation updateUser($user: EditUserInput!, $userId:ID!) {
            updateUser(user:$user,userId:$userId) {
                name
                dateOfBirth
                bio
            
            }
        }`,
        {
            user,
            userId
        }
    );

    const res = await axios.request(options)
    
    return res.data.data.updateUser;

  }



  // LOGIN User
  static async authenticateUser(user:LoginInput) {

    let options = this.graphqlOptions(`
        query login($user: UserLoginInput! ) {
            login(user:$user) {
                token
                user {
                    _id
                }
            }
        }`,
        {
            user
        }
    );

    const res = await axios.request(options)
    
    return res.data.data.login;

  }


  //GET user
  static async getUser(id:string) {

    let options = this.graphqlOptions(`
        query user($id: ID! ) {
            user(id:$id) {
                name
                email
                dateOfBirth
                bio

                createdEvents {
                    _id
                    title
                    description
                    dateTime
                    where
                }
                bookings {
                    _id
                    event {
                        _id
                        title
                        dateTime
                        where
                    } 
                    createdAt
                }

            }
        }`,
        {
            id
        }
    );

    const res = await axios.request(options)
    
    return res.data.data.user;

}

// GET USER by Name
static async getUserByEmail(email:string) {
    let options = this.graphqlOptions(`
        query getUserByEmail($email: String! ) {
            getUserByEmail(email:$email) {
                _id
                name
            }
        }`,
        {
            email
        }
    );  

    const res = await axios.request(options)
    
    return res.data.data.getUserByEmail;

}

//GET ALL EVENTS
  static async getEvents() {

    let options = this.graphqlOptions(`{
            events {
                _id
                title
                where
                description
                dateTime
            }
        }`
    );

    const res = await axios.request(options)
    
    return res.data.data.events;
  }
  
  
  static async getEvent(id:string) {
    let options = this.graphqlOptions(`
        query event($id: ID! ) {
            event(id:$id) {
                _id
                title
                description
                dateTime
                where
                price
                hosts {
                    _id
                    name
                }
                maxNumberOfAttendees
                createdBy {
                    _id
                    name
                    bio
                    createdEvents {
                        _id
                        title
                        description
                        dateTime
                        where
                    }

                }
                bookings {
                    _id
                    user {
                        _id
                        name
                    }
                    createdAt
                }
    
            }
        }`,
        {
            id
        }
    );

    const res = await axios.request(options)
    
    return res.data.data.event;

}

//Book Event
static async bookEvent(eventId:(string | undefined)) {
    let options = this.graphqlOptions(`
        mutation bookEvent($eventId: String! ) {
            bookEvent(eventId:$eventId) {
                message
            }
        }`,
        {
            eventId
        }
    );

    const res = await axios.request(options)
    return res.data.data.bookEvent.message;

  }

// CANCEL Booking(id)
static async cancelBooking(eventId:string) {
    let options = this.graphqlOptions(`
        mutation cancelBooking($eventId: ID!) {
            cancelBooking(eventId:$eventId) {
                message
            }
        }`,
        {
            eventId
        }
    );

    const res = await axios.request(options)
    return res.data.data.cancelBooking.message;

  }


// CREATE EVENT
static async createEvent(event:CreateEventInput) {
    let options = this.graphqlOptions(`
        mutation createEvent($event: EventInput! ) {
            createEvent(event:$event) {
                title
            }
        }`,
        {
            event
        }
    );

    const res = await axios.request(options)
    return res.data.data.createEvent.title;

  }

  // UPDATE EVENT
  static async updateEvent(eventId:string,event:UpdateEventInput) {
    let options = this.graphqlOptions(`
        mutation updateEvent($event: UpdateEventInput!, $eventId: String!) {
            updateEvent(event:$event, eventId:$eventId) {
                _id
                title
                description
                dateTime
                where
                price
                hosts {
                    _id
                    name
                }
                maxNumberOfAttendees
                createdBy {
                    _id
                    name
                    bio
                    createdEvents {
                        _id
                        title
                        description
                        dateTime
                        where
                    }

                }
                bookings {
                    _id
                    user {
                        _id
                        name
                    }
                    createdAt
                }
            
            }
        }`,
        {
            event,
            eventId
        }
    );

    const res = await axios.request(options)
    return res.data.data.updateEvent;

  }

  // DELETE EVENT
  static async deleteEvent(id:string) {
    let options = this.graphqlOptions(`
        mutation deleteEvent($id: ID!) {
            deleteEvent(id:$id) {
                message
            }
        }`,
        {
            id
        }
    );

    const res = await axios.request(options)
    return res.data.data.deleteEvent.message;
  }

}

export default API;