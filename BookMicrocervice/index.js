import express from 'express';
import mongoose from "mongoose";
import redis from 'redis';
import cors from "cors";
import { bookValidation } from './validation.js';
import { BookController } from './controllers/index.js';
import {handleValidationErrors, checkAuth} from './utils/index.js';
import timeout from "connect-timeout";
import rateLimit from "express-rate-limit";

const app = express();

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiter to all requests
app.use(limiter);

app.use(express.json());
app.use(cors());
app.use(timeout('10s'));

mongoose.connect('mongodb://localhost:27018/BookServiceBooks').then(() => {
    console.log("DB ok");
}).catch((err) => console.log('DB error', err))

function haltOnTimeOut(req, res, next) {
    if (!req.timedout) next();
}
app.use(haltOnTimeOut);


app.get('/books', BookController.getAll);
app.get('/books/:id', BookController.getOne);
app.post('/books', checkAuth, bookValidation, handleValidationErrors, BookController.create);
app.delete('/books/:id', checkAuth, BookController.remove);
app.patch('/books/:id', checkAuth, bookValidation, handleValidationErrors, BookController.update);

app.post('/checkAvailability/:id', checkAuth, BookController.checkAvailability);
app.post('/changeStatus/:id', checkAuth, BookController.changeStatus);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
