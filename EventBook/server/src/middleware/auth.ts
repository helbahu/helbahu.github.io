import verifyToken from "../helpers/verifyToken.js";
import { UserInterface } from "../resolvers/interfaces.js";

const isAuth = (req,res,next) => {
    const authHeader = req.get('Authorization');

    let payload:UserInterface;
    if(authHeader) {
        const token = authHeader.split(" ")[1];
        try{
            payload = verifyToken(token);
        }catch (err) {
            req.isAuth = false;
            return next();
        }        
    }

    if(payload){
        req.isAuth = true;
        req.userId = payload._id;
        return next();
    }

    req.isAuth = false;
    return next();

}

export default isAuth;