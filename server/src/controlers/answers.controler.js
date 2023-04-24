const Answer = require('../models/answers.model');

exports.create = async(req,res) => {
    const {
        user_id,
        content
    } = req.body;
    const question_id = req.params.id;
    try {
        if(!req.body) {
            res.status(400).send({
                message: 'Content can not be empty!'
            });
            return;
        }

        if (!user_id || !question_id || !content ) {
            res.status(400).send({
                message: 'All fields are required!'
            });
            return;
        }

        const answer = new Answer({
            user_id : user_id,
            question_id : question_id,
            content : content,
            created_at : new Date()
        });

        await Answer.create(answer);

        res.status(201).send({
            message: 'Answer created',
            answer : answer 
        });

    } catch (err) {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the Order.',
        });
    }
}; 

exports.getAll = async (req,res) => {
    try {

        const results = await Answer.getAll();

        res.status(200).send(results);
        
    } catch (err) {

        console.error('Error in exports.getAll:', err);
        res.status(500).send({
            message: 'An error occurred while retrieving Answers',
            error: err.message
        });
    }
};

exports.getById = async (req,res) => {
    try {

        const id = req.params.id;
        const answer = await Answer.getById(id);

        res.status(200).send(answer);

    } catch (err) {

        if (err.message === 'not_found') {
            res.status(404).send({ message: 'Not found Answer with id.'});
        } else {
            res.status(500).send({ message: 'Error retrieving Answer with id '});
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

        newData.updated_at = new Date();

        await Answer.update(id,newData);

        res.status(200).send({
            message: 'Answer updated!'
        });

    } catch (err) {

        res.status(500).send({
            message: err.message || 'Some error occurred while creating the Order.',
        });
        
    }
};

exports.delete = async (req,res) => {
    try {

        const id = req.params.id;
        
        await Answer.delete(id);

        res.send({
            message: 'Answer deleted successfully!'
        }).status(204);

    } catch (err) {
        
        if (err.message === 'not_found') {
            res.status(404).send({ message: 'Not found Answer with id.'});
        } else {
            res.status(500).send({ message: 'Error retrieving Answer with id '});
            console.log(err);
        }
    }
};

exports.getByQuestionId = async (req, res) => {
    try {
        const questionId = req.params.questionId;
        
        const questions = await Answer.getByQuestionId(questionId);
        res.status(200).send(questions);
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving questions for user',
        });
    }
};