const Question = require('../models/question.model');


exports.create = async (req,res) => {
    const {
        user_id,
        category_id,
        content,
        title
    } = req.body;
    
    try {

        if(!req.body) {
            res.status(400).send({
                message: 'Content can not be empty!'
            });
            return;
        }

        // check for not null
        

        if (!user_id || !category_id || !content || !title ) {
            res.status(400).send({
                message: 'All fields are required!'
            });
            return;
        }

        const question = new Question({
            user_id: user_id,
            category_id: category_id,
            content: content,
            title: title,
            created_at: new Date()
        });

        await Question.create(question);

        res.status(201).send({
            message: 'Question created!',
            question:question
        });

    } catch (err) {
        if (err.message === 'category_not_found') {
            return res.status(404).send({
                message: `Category with id: ${category_id} not found!`,
            });
        } else {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the Order.',
            });
        }
    }
};

exports.getAll = async (req,res) => {
    try {

        const results = await Question.getAll();

        res.status(200).send(results);
        
    } catch (err) {

        console.error('Error in exports.getAll:', err);
        res.status(500).send({
            message: 'An error occurred while retrieving Questions',
            error: err.message
        });
    }
};

exports.getById = async (req,res) => {
    try {

        const id = req.params.id;
        const question = await Question.getById(id);

        res.status(200).send(question);

    } catch (err) {

        if (err.message === 'not_found') {
            res.status(404).send({ message: 'Not found Question with id.'});
        } else {
            res.status(500).send({ message: 'Error retrieving Question with id '});
        }
    }
};

exports.update = async (req,res) => {
    try {

        const id = req.params.id;
        const newData = req.body;

        if (!newData) {
            return res.status(400).send({ message: 'Content can not be empty!' });
        }

        newData.created_at = new Date();

        await Question.update(id,newData);

        res.status(200).send({
            message: 'Question updated!'
        });

    } catch (err) {

        if (err.message === 'category_not_found') {
            return res.status(404).send({
                message: 'Category with id not found!',
            });
        }  else {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the Order.',
            });
        }
    }
};

exports.delete = async (req,res) => {
    try {

        const id = req.params.id;
        
        await Question.delete(id);

        res.send({
            message: 'Question deleted successfully!'
        }).status(204);

    } catch (err) {
        
        if (err.message === 'not_found') {
            res.status(404).send({ message: 'Not found Question with id.'});
        } else {
            res.status(500).send({ message: 'Error retrieving Question with id '});
            console.log(err);
        }
    }
};

exports.getByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);
        const questions = await Question.getByUserId(userId);
        res.status(200).send(questions);
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving questions for user',
        });
    }
};