import "dotenv/config";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET
export function generateToken(user){
    try{
        const payload = {
            _id: user._id,
            email: user.email,
            role: user.role
        }
        const token = jwt.sign(payload, SECRET);
        return token;
    }catch(err){
        console.log(`Error while generating token: ${err}`)
    }
}