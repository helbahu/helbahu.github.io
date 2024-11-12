import jwt from 'jsonwebtoken';

const verifyToken = (token:any) => {
    const payload = jwt.verify(token,process.env.JWT_SECRET_KEY);
    return payload;
}

export default verifyToken;