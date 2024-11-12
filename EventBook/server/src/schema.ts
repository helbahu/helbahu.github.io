const schema = `#graphql
    type User {
        _id: ID!
        name: String!
        email: String! 
        dateOfBirth: String!
        bio: String!

        createdEvents: [Event!]
        bookings: [Booking!]
        
    }

    type UserAndToken {
        user: User!
        token: String!
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float
        dateTime: String! #Time value (later see if you can specifically choose that)

        where: String!
        hosts: [User!]
        maxNumberOfAttendees: Int
        # attending: [User!]
        # waitList: [User!]
        createdBy: User!
        bookings: [Booking!]

    }

    type Booking {
        _id: ID!
        user: User!
        event: Event! 
        createdAt: String!
        updatedAt: String!
    }


    type MessageObj {
        message: String!
    }



    type RootQuery {
        events: [Event!]
        event(id:ID!): Event!
        login(user: UserLoginInput!): UserAndToken!
        bookings: [Booking!]
        booking(id:ID!): Booking!
        user(id:ID!): User!
        getUserByEmail(email:String!): User!
    }

    type RootMutations {
        register(user: UserRegisterInput): UserAndToken!
        updateUser(user: EditUserInput!, userId:ID!): User!

        createEvent(event: EventInput!): Event!
        updateEvent(event: UpdateEventInput!, eventId:String!): Event!
        deleteEvent(id:ID!): MessageObj!

        bookEvent(eventId: String!): MessageObj!
        cancelBooking(eventId:ID!): MessageObj!

    }

    input EventInput {
        title: String!
        description: String!
        price: Float
        dateTime: String!
        where: String!
        hosts: [String!]
        maxNumberOfAttendees: Int

    }
    input UpdateEventInput {
        title: String
        description: String
        price: Float
        dateTime: String
        where: String
        hosts: [String!]
        maxNumberOfAttendees: Int
    }


    input UserRegisterInput {
        name: String!
        email: String!
        dateOfBirth: String!
        bio: String!
        password: String! #Password will be made into a hash.
    }
    input EditUserInput {
        name: String
        dateOfBirth: String
        bio: String
        password: String #Password will be made into a hash.
    }
    input UserLoginInput {
        email: String!
        password: String! #Password will be compared to hash.
    }


    schema {
        query: RootQuery
        mutation: RootMutations
    }




`;

export default schema;