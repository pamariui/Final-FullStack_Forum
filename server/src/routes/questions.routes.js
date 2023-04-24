const express = require('express');
const question = require('../controlers/question.controler');
const authenticate = require('../middleware/auth');

const questionRouter = new express.Router();

questionRouter.post('/api/v1/questions', question.create);
questionRouter.get('/api/v1/questions', question.getAll);
questionRouter.get('/api/v1/questions/:id', question.getById);
questionRouter.patch('/api/v1/questions/:id', question.update);
questionRouter.delete('/api/v1/questions/:id', question.delete);
questionRouter.get('/api/v1/questions/user/:id', question.getByUserId);


module.exports = questionRouter;