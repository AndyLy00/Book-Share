import {body} from "express-validator";
export const bookValidation = [
    body('title', "Please fill the title").isLength({min: 3}).isString(),
    body('author', "Please fill the author").isString(),
    body('description', "Please fill the description").isLength({min: 5}).isString(),
    body('price', "Please fill the price").isNumeric(),
    body('owner', "No owner").isString(),
    body('state', "No Status").isString(),
    body('category', "No Category").isArray(),
];
