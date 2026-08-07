import express from "express";
import { signUpValdiation, signInValidation, otpValidator } from "../lib/validations.js";
import { handleSignIn, handleSignOut, handleSignUp, handleUserCount, resendOtp, verifyOtp } from "../controllers/userController.js";
import { authAdmin } from "../middleware/authorization.js";
import { verifiedUser } from "../middleware/checkVerification.js";

const userRoutes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *         username:
 *           type: string
 *           example: "johndoe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         role:
 *           type: string
 *           enum: [buyer, seller, admin]
 *           example: "buyer"
 *         isVerified:
 *           type: boolean
 *           example: false
 *         isTemporaryAccess:
 *           type: boolean
 *           example: false
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error message details"
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 *               location:
 *                 type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [buyer, seller, admin]
 *                 example: buyer
 *     responses:
 *       201:
 *         description: User registered successfully, OTP sent to email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP sent to your email, please verify."
 *       200:
 *         description: Email service down; granted 12-hour temporary access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 temporaryAccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email service is currently unavailable. You have been granted temporary access for 12 hours."
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       409:
 *         description: Email already exists and is verified
 */
userRoutes.post("/auth/signup", signUpValdiation(), handleSignUp);

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify email address using OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully!"
 *       400:
 *         description: Invalid or expired OTP / Validation failure
 *       404:
 *         description: User not found
 */
userRoutes.post("/verify-otp", otpValidator, verifyOtp);

/**
 * @swagger
 * /resend-otp:
 *   post:
 *     summary: Resend verification OTP code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: New OTP sent successfully
 *       400:
 *         description: User already verified or validation failure
 *       404:
 *         description: User not found
 */
userRoutes.post("/resend-otp", resendOtp);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Authenticate user and sign in
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: password123
 *     responses:
 *       200:
 *         description: Signed in successfully
 *       400:
 *         description: Invalid credentials or validation failure
 *       403:
 *         description: Email not verified and temporary access window expired
 *       404:
 *         description: User not found
 */
userRoutes.post("/auth/signin", verifiedUser, signInValidation(), handleSignIn);

/**
 * @swagger
 * /auth/signout:
 *   get:
 *     summary: Sign out current user session
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: User signed out successfully
 */
userRoutes.get("/auth/signout", handleSignOut);

/**
 * @swagger
 * /user-count:
 *   get:
 *     summary: Get total user count (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 150
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       403:
 *         description: Forbidden (User is not an admin)
 */
userRoutes.get("/user-count", authAdmin(), handleUserCount);

export default userRoutes;
