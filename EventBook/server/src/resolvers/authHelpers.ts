import { Types } from "mongoose";

const isLoggedIn = (req:{userId:(string | undefined), isAuth:boolean},errorMessage="Unauthorized. Not logged in.") => {
    if(!req.isAuth){
        throw new Error(errorMessage);
    }

}

const isCorrectUser = (req:{userId:(string | undefined), isAuth:boolean},userId:string | Types.ObjectId,errorMessage="Unauthorized.") => {
    if(req.userId !== userId.toString()){
        throw new Error(errorMessage);
    }

}



export {isCorrectUser, isLoggedIn};