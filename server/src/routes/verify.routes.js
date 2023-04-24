const express = require('express');
const authenticate = require('../middleware/auth');


const VerifyRouter = express.Router();

VerifyRouter.get('/api/v1/verify', authenticate, (req, res) => {
    const { id, username, email } = req.user;
    res.status(200).json({ id, username, email });
});



module.exports = VerifyRouter;