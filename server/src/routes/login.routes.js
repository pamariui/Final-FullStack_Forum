const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('../models/users.model');
require('dotenv').config();

const LoginRouter = express.Router();

LoginRouter.post('/api/v1/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.getByUsername(username);
    
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
        );

        res.status(200).json({ token });
       

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = LoginRouter;