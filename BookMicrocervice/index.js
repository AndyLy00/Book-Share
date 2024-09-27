import express from 'express';
import mongoose from "mongoose";
import redis from 'redis';
import cors from "cors";
import { bookValidation } from './validation.js';
import { BookController } from './controllers/index.js';
import {handleValidationErrors, checkAuth} from './utils/index.js';
import timeout from "connect-timeout";

const app = express();
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

app.post('/rent', checkAuth, BookController.create);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
