import { body } from "express-validator";

export function validateInputs() {
    return [
        body("productId").isString().isLength({ min: 24, max: 24 }).withMessage("Enter a valid productId"),
        body("quantity").isInt({ min: 1 }).withMessage("Enter a valid Quantity")
    ];
}

export function validateOrderInputs(){
    return[
        body("houseno").isString().isLength({min: 1}).withMessage("Enter a valid house number"),
        body("street").isString().isLength({min: 5}).withMessage("Enter a valid street"),
        body("city").isString().isLength({min: 5}).withMessage("Enter a valid name"),
        body("pincode").isString().isLength({min: 6}).withMessage("Enter a valid pincode number"),
        body("state").isString().isLength({min: 2}).withMessage("Enter a valid state and or state code"),
        body("mobileNumber").isString().isLength({min: 10}).withMessage("Enter a valid mobile number"),
        body("paymentType").isString().isLength({min: 4}).withMessage("Enter a valid payment type"),
        body("paymentStatus").isString().isLength({min: 4}).withMessage("Enter a valid payment status")
    ]
}