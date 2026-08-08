import {body} from "express-validator";

export const cakeEntryValidation = ()=>[
    body('name').isLength({min: 5}).withMessage("name must be atleast 5 characters long"),
    body('description').isLength({min: 10}).withMessage("description must be atleast 10 characters long"),
    body('category').isLength({min: 5}).withMessage("category must be atleast 5 characters long"),
    body('price').isFloat({gt: 0}).withMessage("price should be greater than 0")
]