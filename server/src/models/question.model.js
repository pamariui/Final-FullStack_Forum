const mysql = require('mysql2/promise');
const mysqlConfig = require('../config/db.config');

const Question = function(question) {
    this.id = question.id;
    this.user_id = question.user_id;
    this.category_id = question.category_id;
    this.title = question.title;
    this.content = question.content;
    this.created_at = question.created_at;
    this.updated_at = question.updated_at;
};

Question.create = async (newQuestion, result) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);

        // Chek if category exists
        const [categoryRows] = await con.query(
            `SELECT * 
            FROM categories
            WHERE id = ?`,
            [newQuestion.category_id]
        );
        if(categoryRows.length === 0) {
            throw { message: 'category_not_found' };
        }

        const query = 'INSERT INTO questions SET ?';

        con.query(query,newQuestion, (err,res) => {
            if(err) {
                console.log('error:', err);
                result(err, null);
                return;
            }

            console.log('Created question', { id: res.insertId, ...newQuestion});
            result(null, { id: res.insertId, ...newQuestion});
        });

        await con.end();

    } catch (err) {
        console.log(err);
        throw err;
    }
};

Question.getAll = async () => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = `SELECT 
                            questions.id, 
                            questions.title, 
                            questions.content, 
                            users.username AS user, 
                            categories.category AS category,
                            questions.created_at, 
                            questions.updated_at
                        FROM questions 
                        LEFT JOIN users ON 
                            questions.user_id = users.id 
                        LEFT JOIN categories ON 
                            questions.category_id = categories.id;`;

        const [results] = await con.execute(query);

        await con.end();
        return results;

    } catch (err) {

        console.log(err);
        throw err;
    }
};

Question.getById = async (id) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = `SELECT 
                            questions.id, 
                            questions.title, 
                            questions.content, 
                            questions.created_at, 
                            questions.updated_at, 
                            users.username AS user, 
                            categories.category AS category
                        FROM questions
                        LEFT JOIN users ON 
                            questions.user_id = users.id
                        LEFT JOIN categories ON 
                            questions.category_id = categories.id
                        WHERE questions.id = ?;
 `;
        const [results] = await con.execute(query,[id]);
    
        if (!results.length) {
            throw { message: 'not_found' };
        }

        await con.end();
        return results[0];

    } catch (err) {

        console.log(err);
        throw err;
    }
};

Question.update = async (id, newData) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        // Chek if category exists
        const [categoryRows] = await con.query(
            `SELECT * 
            FROM categories
            WHERE id = ?`,
            [newData.category_id]
        );
        if(categoryRows.length === 0) {
            throw { message: 'category_not_found' };
        }
        const query = 'SELECT * FROM questions WHERE id = ?';

        const updateQuery =`UPDATE questions SET 
                                category_id = COALESCE(?, category_id),
                                title = COALESCE(?, title),
                                content = COALESCE(?, content)
                            WHERE id = ?`;

        const [results] = await con.execute(query,[id]);
        
        if(results.length === 0) {
            throw { message: 'not_found' };
        } else {
            con.execute(updateQuery, [
                newData.category_id,
                newData.title,
                newData.content,
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

Question.delete = async (id) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = 'DELETE FROM questions WHERE id = ?';
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

Question.getByUserId = async (userId) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = `SELECT 
                            questions.id, 
                            questions.title, 
                            questions.content, 
                            users.username AS user, 
                            categories.category AS category,
                            questions.created_at, 
                            questions.updated_at
                        FROM questions 
                        LEFT JOIN users ON 
                            questions.user_id = users.id 
                        LEFT JOIN categories ON 
                            questions.category_id = categories.id
                        WHERE questions.user_id = ?;`;

        const [results] = await con.execute(query, [userId]);

        await con.end();
        return results;

    } catch (err) {

        console.log(err);
        throw err;
    }
};

module.exports = Question;