import { User } from "../models/schema.js";

export const verifiedUser = async(req, res, next)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "user not found"})
        }

        if (user.isVerified) {
            return next();
        }

        if (user.isTemporaryAccess && user.temporaryAccessExpiresAt) {
            const now = new Date();
            const expiresAt = new Date(user.temporaryAccessExpiresAt);

            if (now < expiresAt) {
                return next();
            } else {
                user.isTemporaryAccess = false;
                user.temporaryAccessExpiresAt = null;
                await user.save();
            }
        }
        return res.status(403).json({
            success: false,
            message: 'Email verification required. Your temporary access window has expired or is invalid.',
        });
    }catch(err){
        next(err)
    }
}