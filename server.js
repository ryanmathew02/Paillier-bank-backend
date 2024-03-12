const express = require('express');
const app = express();
require('dotenv').config();
require('./connection');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ['Set-Cookie', 'Date', 'ETag']
}


const UsesController = require('./Routes/UserController');

app.use(cookieParser())
app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/user', UsesController)
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})