import {body} from "express-validator";

// Functions to verify Request Structure
export const loginValidation = [
    body('email', "Something is wrong with your email").isEmail(),
    body('password', "Your password should be longer than 8 characters").isLength({min: 8}),
];

export const registerValidation = [
    body('email', "Something is wrong with your email").isEmail(),
    body('password', "Your password should be longer than 8 characters").isLength({min: 8}),
    body('nickname', "Your name should be longer than 3 characters").isLength({min: 3}),
];
