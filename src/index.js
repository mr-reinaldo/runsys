import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';

import routes from './routes.js';


// Load environment variables
dotenv.config();

// Create express app
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Create server
const server = createServer(app);

// Create socket
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Set socket
app.set('io', io);

// Start server
server.listen(process.env.PORT, () => {
    console.log(`
        Server running!
        Listening on: http://localhost:${process.env.PORT}

        Press CTRL+C to stop
    `);
});
