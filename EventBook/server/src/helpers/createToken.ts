import jwt from 'jsonwebtoken';

const createToken = (data:any) => {
    const token = jwt.sign(data,process.env.JWT_SECRET_KEY,{expiresIn: '24h'});
    return token;
}

export default createToken;