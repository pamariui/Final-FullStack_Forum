const express = require('express');
const user = require('../controlers/users.controler');

const userRouter = new express.Router();

userRouter.post('/api/v1/users', user.create);
userRouter.get('/api/v1/users', user.getAll);
userRouter.get('/api/v1/users/:id', user.getById);
userRouter.patch('/api/v1/users/:id', user.update);
userRouter.delete('/api/v1/users/:id', user.delete);

module.exports = userRouter;