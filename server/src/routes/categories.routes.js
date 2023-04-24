const express = require('express');
const category = require('../controlers/categories.controler');

const categoryRouter = new express.Router();

categoryRouter.post('/api/v1/categories', category.create);
categoryRouter.get('/api/v1/categories', category.getAll);
categoryRouter.get('/api/v1/categories/:id', category.getById);
categoryRouter.patch('/api/v1/categories/:id', category.update);
categoryRouter.delete('/api/v1/categories/:id', category.delete);

module.exports = categoryRouter;