import bcrypt from "bcryptjs";
import crypto from 'crypto'
import {User} from "../models/schema.js";
import { validationResult } from 'express-validator';
import {generateToken} from "../lib/tokenGeneration.js";
import { sendVerificationOtp } from "../lib/emailService.js";

export const handleSignUp = async (req, res, next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {username, email, password, role} = req.body;
        let user = await User.findOne({email});

        if(user){
            if(user.isVerified){
                return res.status(409).json({message: "email already exist and verified"});
            }
        }else{
            const salt = 10;
            const hashedPassword = await bcrypt.hash(password, salt);
            user = new User({username, email, password: hashedPassword, role})
        }
        
        try{
            const otp = crypto.randomInt(100000, 999999).toString();
            const expireAt = new Date(Date.now() + 10 * 60 * 1000);
            user.otp = otp;
            user.otpExpiresAt = expireAt;
            await user.save();
            await sendVerificationOtp(email, otp);
            return res.status(201).json({success: true, message: "Opt send to your email, verify yourself"})
        }catch(emailErr){
            console.log("Email service server down ", emailErr.message)
            user.isVerified=false;
            user.isTemporaryAccess = true;
            user.temporaryAccessExpiresAt= new Date(Date.now() + 12 * 60 * 60 * 1000);
            await user.save();

            return res.status(200).json({
                success: true,
                temporaryAccess: true,
                message: 'Email service is currently unavailable. You have been granted temporary access for 12 hours. Please verify your email later.',
            });
        }
    }catch(err){
        next(err);
    }
}

export const verifyOtp = async (req, res, next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {email, otp} = req.body;    
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: "user not found"})
        }

        if(user.isVerified){
            return res.status(400).json({message: "user exist and verified"})
        }

        if(!user.otp || user.otp !== otp){
            return res.status(400).json({message: "Invalid otp"})
        }

        if (new Date() > user.otpExpiresAt) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully!'
        });
    }catch(err){
        next(err);
    }
}

export const resendOtp = async (req, res, next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {email} = req.body;
        const user = await User.findOne({email})

        if(!user){
            return res.status(404).json({message: "user not found"})
        }

        if(user.isVerified){
            return res.status(400).json({message: "You are already verified"})
        }
        
        if (user.otpExpiresAt) {
            const timeRemaining = user.otpExpiresAt.getTime() - Date.now();
            const tenMinutes = 10 * 60 * 1000;
            const timeSinceLastOtp = tenMinutes - timeRemaining;

            if (timeSinceLastOtp < 60 * 1000) {
                const waitSeconds = Math.ceil((60 * 1000 - timeSinceLastOtp) / 1000);
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${waitSeconds} seconds before requesting another code.`
                });
            }
        }

        const newOtp = crypto.randomInt(100000, 999999).toString();
        const newExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 

        user.otp = newOtp;
        user.otpExpiresAt = newExpiresAt;
        await user.save();

        await sendVerificationOtp(email, newOtp);

        return res.status(200).json({
        success: true,
        message: 'A new verification code has been sent to your email.',
        });

    }catch(err){
        next(err);
    }
}
    
export const handleSignIn = async (req, res, next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const {email, password} = req.body;
        const isUserExist = await User.findOne({email})
        if(!isUserExist){
            return res.status(404).json({message: "user not found"})
        }

        const matchedPassword = await bcrypt.compare(password, isUserExist.password);
        if(!matchedPassword){
            return res.status(400).json({message: "Invalid password"})
        }

        const token = generateToken(isUserExist)
        res.cookie('token', token, {httpOnly: true});

        return res.status(200).json({message: "user logged in", token: token})
    }catch(err){
        next(err);
    }
}

export const handleSignOut = async (req, res, next)=>{
    try{
        res.clearCookie('token');
        return res.status(200).json({message: "user logged out"})
    }catch(err){
        next(err);
    }
}

export const handleUserCount = async (req, res, next)=>{
    try{
        const [totalCount, totalBuyers, totalSellers] = await Promise.all([
            User.countDocuments({role: {$in: ["buyer", "seller"]}}),
            User.countDocuments({role: "buyer"}),
            User.countDocuments({role: "seller"})
        ])
        res.status(200).json({success: true, 
            totalCount: totalCount,
            totalBuyers: totalBuyers,
            totalSellers: totalSellers
        })
    }catch(err){
        next(err);
    }
}

export const handleGetCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        _id: req.user._id,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get current user",
    });
  }
};