import mongoose, {Schema} from "mongoose";

const required = true;

const bookingSchema = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required
    }

}, 
{timestamps: true}
);

export default mongoose.model('Booking',bookingSchema);