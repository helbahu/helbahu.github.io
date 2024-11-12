import mongoose, {Schema} from "mongoose";

const required = true;

const ReqStr = {
    type: String,
    required
};

const eventSchema = new Schema({
    title: ReqStr,
    description: ReqStr,
    price: {
        type: Number,
        required,
        default: 0
    },
    dateTime: {
        type: Date,
        required
    },
    where: ReqStr,
    hosts: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        // type: [ReqStr],
        default: []
    },
    maxNumberOfAttendees: {
        type: Number
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

})

export default mongoose.model('Event',eventSchema);