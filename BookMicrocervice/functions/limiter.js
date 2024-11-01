import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
})
