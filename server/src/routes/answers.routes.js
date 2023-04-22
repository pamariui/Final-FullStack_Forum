const express = require('express');
const answer = require('../controlers/answers.controler');


const answerRouter = new express.Router();

answerRouter.post('/api/v1/question/:id/answer/', answer.create);
answerRouter.get('/api/v1/question/answers', answer.getAll);
answerRouter.get('/api/v1/question/answers/:id', answer.getById);
answerRouter.patch('/api/v1/question/answers/:id', answer.update);
answerRouter.delete('/api/v1/question/answers/:id', answer.delete);
answerRouter.get('/api/v1/questions/:questionId/answer/', answer.getByQuestionId);

module.exports = answerRouter;