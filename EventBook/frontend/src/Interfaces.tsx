interface UserRegisterInput {
    name: string,
    email: string,
    dateOfBirth: string,
    bio: string,
    password: string,
    rePassword?:string
}

interface EditUserInput {
    name?: string,
    dateOfBirth?: string,
    bio?: string,
    password?: string,
    rePassword?:string
}


interface LoginInput {
    email: string,
    password: string
}

interface CreateEventInput {
    title: string,
    description: string,
    price: number,
    dateTime: string,
    where: string,
    hosts: string[],
    maxNumberOfAttendees: number

}

interface CreateEventFormInput {
    title: string,
    description: string,
    price: number,
    dateTime: string,
    where: string,
    hosts: string[],
    maxNumberOfAttendees: number,
    host?:string
    isHost?:boolean;
}


interface UpdateEventInput {
    title?: string,
    description?: string,
    price?: number,
    dateTime?: string,
    where?: string,
    hosts?: string[],
    maxNumberOfAttendees?: number,
    isHost?:boolean
}

interface EventObj {        
    _id:string,
    title:string,
    where:string,
    description:string,
    dateTime:string
}



interface createdBy {
    _id:string,
    name:string,
    bio:string,
    createdEvents: EventObj[]
}
interface Host {
    _id:string,
    name:string
}
interface Booking {
    _id: string,
    createdAt: string,
    user: {
        _id:string,
        name:string            
    }
}
interface EventDetailsObj {
    _id:string,
    title:string,
    where:string,
    description:string,
    dateTime:string,
    price: number,
    maxNumberOfAttendees: number,
    hosts: Host[],
    createdBy: createdBy,
    bookings: Booking[]
}

interface BookingDetails {
    _id: string,
    createdAt: string,
    event:EventObj
}

interface UserObj {
    name:string,
    email:string,
    dateOfBirth:string,
    bio:string,
    createdEvents: EventObj[],
    bookings:BookingDetails[]
}



export type {UserRegisterInput, LoginInput, CreateEventInput,CreateEventFormInput, UpdateEventInput, EventObj, EventDetailsObj, Host, UserObj,EditUserInput }