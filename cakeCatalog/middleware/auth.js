import jwt from "jsonwebtoken";

export function authorizedSeller(){
    return (req, res, next)=>{
        try{
            const role = req.headers['x-user-role']
            if(role !== "seller"){
                return res.status(403).json({success: false, message: "Permission denied"})
            }
            next();
        }catch(err){
            next(err);
        }
    }
}