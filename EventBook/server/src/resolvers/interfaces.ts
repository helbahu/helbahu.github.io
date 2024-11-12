import { ObjectId } from "mongoose"

interface UserRegisterInput {
    user: {
        name: string,
        email: string,
        dateOfBirth: string,
        bio: string,
        password: string
    }
}

interface EditUserInput {
    user: {
        name: string,
        dateOfBirth: string,
        bio: string,
        password?: string
    },
    userId:string
}



interface EventInput {
    event: {
        title: string,
        description: string,
        price: number,
        dateTime: string,
        where: string,
        hosts: ObjectId[],
        maxNumberOfAttendees: number
    }
}

interface UpdateEventInput {
    event: {
        title: string,
        description: string,
        price: number,
        dateTime: string,
        where: string,
        hosts: ObjectId[],
        maxNumberOfAttendees: number
    },
    eventId: string
}


interface UserLoginInput {
    user: {
        email: string,
        password: string
    }
}


interface EventInterfaceDoc {
    _id: ObjectId,
    title: string,
    description: string,
    price: number,
    dateTime: Date,
    where: string,
    hosts: ObjectId[],
    maxNumberOfAttendees: number
    createdBy: ObjectId
}

interface EventInterface {
    _id: ObjectId,
    title: string,
    description: string,
    price: number,
    dateTime: Date,
    where: string,
    hosts: ObjectId[],
    maxNumberOfAttendees: number
    createdBy: ObjectId,
    _doc: EventInterfaceDoc

}

interface UserInterfaceDoc {
    _id: ObjectId,
    name: string,
    email: string, 
    dateOfBirth: Date,
    bio: string,
    hash: string,
}

interface UserInterface {
    _id: ObjectId,
    name: string,
    email: string, 
    dateOfBirth: Date,
    bio: string,
    hash: string,
    _doc:UserInterfaceDoc
}

interface BookingInterface {
    _id: ObjectId, 
    userId: ObjectId, 
    eventId: ObjectId,
    createdAt: Date,
    updatedAt: Date

}


export {EventInterface, UserInterface, UserRegisterInput, EditUserInput, EventInput, UpdateEventInput, UserLoginInput, BookingInterface};