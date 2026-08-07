import mongoose from "mongoose";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, "username is required"],
        minlength: [3, "username must be at least 3 characters long"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [emailRegex, 'enter a valid email']
    },
    password: {
        type: String,
        required: [true, "password is required"],
        trim: true,
        minlength: [8, "password must be at least 8 characters long"]
    },
    isVerified: {
        type: Boolean,
        default: false  
    },
    isTemporaryAccess: {
        type: Boolean,
        default: false
    },
    temporaryAccessExpiresAt: {
        type: Date,
        default: null
    },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    role: {
        type: String,
        enum: ["buyer", "seller", "admin"],
        required: [true, "role is required"],
    },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);