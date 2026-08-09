import "dotenv/config";
import jwt from "jsonwebtoken";

export function authorizedSeller() {
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

            if (decoded.role !== "seller") {
                return res.status(403).json({
                    success: false,
                    message: "Permission denied"
                });
            }

            req.user = decoded;
            next();
        } catch (err) {
            next(err);
        }
    };
}