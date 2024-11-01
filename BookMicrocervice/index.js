import express from 'express';
import cors from "cors";
import { bookValidation } from './validation.js';
import { BookController } from './controllers/index.js';
import {handleValidationErrors, checkAuth} from './utils/index.js';
import timeout from "connect-timeout";
import { limiter } from "./functions/limiter.js";
import { eureka } from "./functions/eureka.js";
import { database } from "./functions/database.js";
import {socket} from "./functions/socket.js";
import {createServer} from "http";
import { grpcServer } from "./grpcServer/grpcServer.js";

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cors());
app.use(limiter);
app.use(timeout('5s'));

eureka();
database();
socket(server);
grpcServer();

app.get('/books', BookController.getAll);
app.get('/books/:id', BookController.getOne);
app.post('/books', checkAuth, bookValidation, handleValidationErrors, BookController.create);
app.delete('/books/:id', checkAuth, BookController.remove);
app.patch('/books/:id', checkAuth, bookValidation, handleValidationErrors, BookController.update);

app.post('/books/checkAvailability/:id', checkAuth, BookController.checkAvailability);
app.post('/books/changeStatus/:id', checkAuth, BookController.changeStatus);

app.get('/status', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        message: 'Service is running',
        timestamp: new Date().toISOString(),
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
