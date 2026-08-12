import express from "express";
import { signUpValdiation, signInValidation, otpValidator } from "../lib/validations.js";
import { handleSignIn, handleSignOut, handleSignUp, handleUserCount, resendOtp, verifyOtp, handleGetCurrentUser} from "../controllers/userController.js";
import { authAdmin, authorizedUser} from "../middleware/authorization.js";
import { verifiedUser } from "../middleware/checkVerification.js";

const userRoutes = express.Router();

userRoutes.post("/auth/signup", signUpValdiation(), handleSignUp);
userRoutes.post("/auth/verify-otp", otpValidator(), verifyOtp);
userRoutes.post("/auth/resend-otp", resendOtp);

userRoutes.post("/auth/signin", verifiedUser, signInValidation(), handleSignIn);
userRoutes.get("/auth/signout", handleSignOut);

userRoutes.get("/auth/user-count", authAdmin(), handleUserCount);
userRoutes.get("/auth/me", authorizedUser(), handleGetCurrentUser)
export default userRoutes;