const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRouter = require('./src/routes/users.routes');
const LoginRouter = require('./src/routes/login.routes');
const VerifyRouter = require('./src/routes/verify.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(LoginRouter);
app.use(VerifyRouter);

const PORT = process.env.SERVER_PORT || 4040;

app.listen (PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});


