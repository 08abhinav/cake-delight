import "dotenv/config";
import jwt from "jsonwebtoken";

export function authAdmin() {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            const token = req.cookies?.token || (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

            if (!token) {
                return res.status(401).json({ message: "Unauthorized access: Token missing" });
            }

            const payload = jwt.verify(token, process.env.JWT_SECRET);
            if (payload.role !== "admin") {
                return res.status(403).json({ error: "forbidden", message: "Permission denied" });
            }

            req.user = payload;
            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    };
}