const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const mysqlConfig = require('../config/db.config');

const User = function(user) {
    this.id = user.id;
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
    this.created_at = user.created_at;
};

User.create = async (newUser, result) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword;

        const query = 'INSERT INTO users SET ?';

        con.query(query,newUser, (err,res) => {
            if(err) {
                console.log('error:', err);
                result(err, null);
                return;
            }

            console.log('User created', { id: res.insertId, ...newUser});
            result(null, { id: res.insertId, ...newUser});
        });

        await con.end();

    } catch (err) {
        console.log(err);
        throw err;
    }
};

User.getById = async (id) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = `SELECT *
                       FROM users 
                       WHERE id= ?`;
        const [results] = await con.execute(query,[id]);

        if (!results.length) {
            throw { message: 'not_found' };
        }

        const user = results[0];

        // Verify the password when retrieving the user
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        // if (!isPasswordValid) {
        //     throw { message: 'invalid_password' };
        // }

        // Remove the password field from the user object before returning it
        delete user.password;

        await con.end();
        return user;

    } catch (err) {
        console.log(err);
        throw err;
    }
};

User.update = async (id, newData) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = 'SELECT * FROM users WHERE id = ?';

        const updateQuery =`UPDATE users SET 
                                password = COALESCE(?, password),
                                email = COALESCE(?, email),
                            WHERE id = ?`;

        const [results] = await con.execute(query,[id]);

        if(results.length === 0) {
            throw { message: 'not_found' };
        } else {
            // Hash the password before updating it
            if (newData.password) {
                newData.password = await bcrypt.hash(newData.password, 10);
            }

            con.execute(updateQuery, [
                newData.password,
                newData.email,
                id], (err,data) => {
                if(err) throw err;
            });
        }

        await con.end();

    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = User;
