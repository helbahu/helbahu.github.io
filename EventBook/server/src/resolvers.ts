import bookingResolvers from './resolvers/bookingResolvers.js';
import eventResolvers from './resolvers/eventResolvers.js';
import userResolvers from './resolvers/userResolvers.js';

const resolvers = {
    ...eventResolvers,
    ...userResolvers,
    ...bookingResolvers

}

export default resolvers;