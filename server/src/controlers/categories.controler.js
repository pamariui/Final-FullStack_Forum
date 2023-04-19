const Category = require('../models/categories.model');


exports.create = async (req,res) => {
    try {

        if(!req.body) {
            res.status(400).send({
                message: 'Content can not be empty!'
            });
            return;
        }

        // chek for not null
        const {category} = req.body;

        if (!category) {
            res.status(400).send({
                message: 'Category  must be filled!'
            });
            return;
        }

        const newCategory = new Category({
            category:category
        });

        await Category.create(newCategory);

        res.status(201).send({
            message: 'Category created!',
            category:newCategory
        });

    } catch (err) {

        res.status(500).send({
            message: err.message || 'Some error occurred while creating the User.'
        });
    }
};

exports.getAll = async (req,res) => {
    try {

        const id = req.params.id;
        const results = await Category.getAll(id);

        res.status(200).send(results);
        
    } catch (err) {

        console.error('Error in exports.getAll:', err);
        res.status(500).send({
            message: 'An error occurred while retrieving Category',
            error: err.message
        });
    }
};

exports.getById = async (req,res) => {
    try {

        const id = req.params.id;
        const category = await Category.getById(id);

        res.status(200).send(category);

    } catch (err) {

        if (err.message === 'not_found') {
            res.status(404).send({ message: 'Not found Category with id.'});
        } else {
            res.status(500).send({ message: 'Error retrieving Category with id '});
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
        await Category.update(id,newData);

        res.status(200).send({
            message: 'Category updated!'
        });

    } catch (err) {

        if (err.message === 'not_found') {
            res.status(404).send({ message: 'Not found Category with id.'});
        } else {
            res.status(500).send({ message: 'Error retrieving Category with id '});
            console.log(err);
        }
    }
};

exports.delete = async (req,res) => {
    try {

        const id = req.params.id;
        
        await Category.delete(id);

        res.send({
            message: 'Category deleted successfully!'
        }).status(204);

    } catch (err) {
        
        if (err.message === 'not_found') {
            res.status(404).send({ message: 'Not found Category with id.'});
        } else {
            res.status(500).send({ message: 'Error retrieving Category with id '});
            console.log(err);
        }
    }
};
