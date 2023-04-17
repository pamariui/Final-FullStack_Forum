const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRouter = require('./src/routes/users.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRouter);

const PORT = process.env.SERVER_PORT || 4040;

app.listen (PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});


