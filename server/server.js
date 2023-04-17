const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


const PORT = process.env.SERVER_PORT || 4040;

app.listen (PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});


