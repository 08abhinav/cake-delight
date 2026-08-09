import "dotenv/config";
import jwt from "jsonwebtoken";

export function authorizedUser() {
    return (req, res, next) => {
        try {
            const token = req.cookies?.token
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            next(err);
        }
    };
}