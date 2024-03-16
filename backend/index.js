const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const WebSocket = require('./websocket');

require('dotenv').config();

const app = express();

app.use(express.json({ limit: "1kb" }));
app.use(cors());

const PORT = process.env.PORT || 5000;

// Set up mongoose

mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connection established");

// Set up routes
app.use('/api/instructor', require('./routes/instructor'));
app.use('/api/student', require('./routes/student'));

const server = app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));
WebSocket.connect(server);