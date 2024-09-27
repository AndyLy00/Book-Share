import { validationResult } from "express-validator";

export default (req, res, next) => {
    // Check validation Errors
    const errors = validationResult(req);
    // Return errors if they were found
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    next();
}