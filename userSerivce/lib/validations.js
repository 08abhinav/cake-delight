import {body} from "express-validator";

export const signUpValdiation = ()=>[
    body('username').isLength({min: 3}).withMessage("username must be 3 characters long"),
    body('email').isEmail().withMessage("Please enter a valid email"),
    body('password').isLength({min: 8}).withMessage("password must be 8 characters long")
]

export const otpValidator = ()=>[
    body('email').isEmail().withMessage("Enter a valid email"),
    body('otp').isLength({min: 6, max: 6}).withMessage("Invalid otp")
]

export const signInValidation = ()=>[
    body('email').isEmail().withMessage("enter a valid email"),
    body('password').isLength({min: 8}).withMessage("password must be 8 characters long")
]