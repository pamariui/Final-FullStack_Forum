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


        const checkQueryUsername = 'SELECT * FROM users WHERE username = ?';
        const [userRows] = await con.query(checkQueryUsername, newUser.username);
       
        if(userRows.length === 1) {
            throw {message: 'user_exist'};
        }

        const checkQueryEmail = 'SELECT * FROM users WHERE email = ?';
        const [emailRows] = await con.query(checkQueryEmail, newUser.email);
        console.log(emailRows.length);
        if(emailRows.length > 1) {
            throw {message: 'email_exist'};
        }

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

        

        await con.end();
        return user;

    } catch (err) {
        console.log(err);
        throw err;
    }
};

User.getAll = async () => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = `SELECT *
                       FROM users`;

        const [results] = await con.execute(query);

        await con.end();
        return results;

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
                                email = COALESCE(?, email)
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

User.getByUsername = async (username) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = `SELECT *
                     FROM users 
                     WHERE username = ?`;
        const [results] = await con.execute(query, [username]);
    
        if (!results.length) {
            throw { message: 'not_found' };
        }
    
        const user = results[0];
    
        await con.end();
        return user;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

User.login = async (username, password) => {
    try {
        const user = await User.getByUsername(username);
  
        if (!user) {
            throw { message: 'user_not_found' };
        }
  
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (!passwordMatch) {
            throw { message: 'invalid_password' };
        }
  
        return user;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

User.delete = async (id) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = 'DELETE FROM users WHERE id = ?';
        const [results] = await con.execute(query, [id]);
        
        if (results.affectedRows === 0) {
            throw { message: 'not_found' };
        }

        await con.end();

    } catch (err) {

        console.log(err);
        throw err;
    }
};

module.exports = User;
