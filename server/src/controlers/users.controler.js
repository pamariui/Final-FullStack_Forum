const User = require('../models/users.model');
const bcrypt = require('bcryptjs');

exports.create = async (req,res) => {
    try {

        if(!req.body) {
            res.status(400).send({
                message: 'Content can not be empty!'
            });
            return;
        }

        // chek for not null
        const { 
            username,
            password,
            email 
        } = req.body;

        if (!username || !password || !email) {
            res.status(400).send({
                message: 'All the fields must be filled'
            });
            return;
        }

        const user = new User({
            username: username,
            password: password,
            email: email
        });

        await User.create(user);

        res.status(201).send({
            message: 'User created!',
            user:user
        });

    } catch (err) {

        res.status(500).send({
            message: err.message || 'Some error occurred while creating the User.'
        });
    }    
};

exports.getAll = async (req,res) => {
    try {

        const results = await User.getAll();

        res.status(200).send(results);
        
    } catch (err) {
        console.error('Error in exports.getAll:', err);
        res.status(500).send({
            message: 'An error occurred while retrieving Users',
            error: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // check if user exists
        const user = await User.getByUsername(username);
        if (!user) {
            res.status(401).send({
                message: 'Invalid username or password'
            });
            return;
        }

        // check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).send({
                message: 'Invalid username or password'
            });
            return;
        }

        res.status(200).send({
            message: 'Login successful',
            user: user
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Some error occurred while logging in'
        });
    }
};

exports.getById = async (req,res) => {
    try {

        const id = req.params.id;
        const user = await User.getById(id);

        res.status(200).send(user);

    } catch (err) {

        if (err.message === 'not_found') {
            res.status(404).send({ message: 'Not found User with id.'});
        } else {
            res.status(500).send({ message: 'Error retrieving User with id '});
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
        await User.update(id,newData);

        res.status(200).send({
            message: 'User updated!'
        });

    } catch (err) {
        if (err.message === 'not_found') {
            res.status(404).send({ message: 'Not found User with id.'});
        } else {
            res.status(500).send({ message: 'Error retrieving User with id '});
            console.log(err);
        }
    }
};

exports.delete = async (req,res) => {
    try {

        const id = req.params.id;
        
        await User.delete(id);

        res.send({
            message: 'User deleted successfully!'
        }).status(204);

    } catch (err) {
        
        if (err.message === 'not_found') {
            res.status(404).send({ message: 'Not found User with id.'});
        } else {
            res.status(500).send({ message: 'Error retrieving User with id '});
            console.log(err);
        }
    }
};