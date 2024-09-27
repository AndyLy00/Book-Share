import express from 'express'
import mongoose from "mongoose";
import { registerValidation, loginValidation } from './validation.js';
import { UserController } from './controllers/index.js';
import {handleValidationErrors, checkAuth} from './utils/index.js';
import cors from 'cors';
import timeout from "connect-timeout";

const app = express();
app.use(express.json());
app.use(cors());
app.use(timeout('10s'));

mongoose.connect('mongodb://localhost:27017/BookServiceUsers').then(() => {
    console.log("DB ok");
}).catch((err) => console.log('DB error', err))

function haltOnTimeOut(req, res, next) {
    if (!req.timedout) next();
}
app.use(haltOnTimeOut);

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/rent', checkAuth, UserController.rent);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
