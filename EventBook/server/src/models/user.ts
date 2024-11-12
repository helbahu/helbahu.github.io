import mongoose, {Schema} from "mongoose";

const required = true;

const ReqStr = {
    type: String,
    required
};

const userSchema = new Schema({
    name: ReqStr,
    email: {...ReqStr,
        unique: true
    }, 
    dateOfBirth: {
        type: Date,
        required
    },
    bio: ReqStr,
    hash: ReqStr

})

export default mongoose.model('User',userSchema);