import bcrypt from 'bcrypt';
import User from '../models/user.js';

import { UserInterface, UserRegisterInput, EditUserInput, UserLoginInput } from './interfaces.js';
import createToken from '../helpers/createToken.js';

import {_userObj} from './resolverHelpers.js'
import { isCorrectUser, isLoggedIn } from './authHelpers.js';


const userResolvers = {
    async user(args:{id:string},req) {
        isCorrectUser(req,args.id);

        const user:any = await User.findById(args.id);
        if(user._id){
            return _userObj(user);
        }

    },
    async getUserByEmail(args:{email:string},req) {
        isLoggedIn(req);
        const user:any = await User.findOne({email: args.email});
        if(user._id){
            return _userObj(user);
        }
    },
    async register(args:UserRegisterInput){
        const hash = await bcrypt.hash(args.user.password,14);

        const user:any = new User({
            ...args.user,
            dateOfBirth: new Date(args.user.dateOfBirth),
            hash 
        });

        await user.save();

        const userObj:UserInterface = {...user._doc, dateOfBirth: user.dateOfBirth.toISOString()};

        return {user:userObj, token: createToken(userObj)};
        
    },
    async updateUser(args:EditUserInput,req) {
        isCorrectUser(req, args.userId);
        if(args.user.password){
            const hash = await bcrypt.hash(args.user.password, 14);
            await User.updateOne({_id: args.userId},{...args.user,hash:hash});
        }else{
            await User.updateOne({_id: args.userId},args.user);
        }

        const user:any = await User.findById(args.userId);
        
        if (user._id) {
            return _userObj(user);
        }

    },

    async login (args:UserLoginInput){
        const user:any = await User.findOne({email: args.user.email});

        if(user){
            const authenticatePassword = await bcrypt.compare(args.user.password, user.hash);
            if(authenticatePassword){
                const userObj = _userObj(user);
                return {user: userObj, token: createToken(userObj)};
            }

        }

    },

}

export default userResolvers;