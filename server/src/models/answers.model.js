const mysql = require('mysql2/promise');
const mysqlConfig = require('../config/db.config');

const Answer = function(answer) {
    this.id = answer.id;
    this.user_id = answer.user_id;
    this.question_id = answer.question_id;
    this.content = answer.content;
    this.created_at = answer.created_at;
    this.updated_at = answer.updated_at;
};

Answer.create = async (newAnswer, result) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);

        const query = 'INSERT INTO answers SET ?';

        con.query(query,newAnswer, (err,res) => {
            if(err) {
                console.log('error:', err);
                result(err, null);
                return;
            }

            console.log('Created question', { id: res.insertId, ...newAnswer});
            result(null, { id: res.insertId, ...newAnswer});
        });

        await con.end();
    } catch (err) {
        console.log(err);
        throw err;
    }
};

Answer.getAll = async () => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = `SELECT 
                            answers.id,
                            users.username AS user,
                            answers.question_id,
                            answers.content,
                            answers.created_at,
                            answers.updated_at
                        FROM answers 
                        LEFT JOIN questions ON 
                            answers.question_id = questions.id
                        LEFT JOIN users ON 
                            answers.user_id = users.id;`;

        const [results] = await con.execute(query);

        await con.end();
        return results;

    } catch (err) {

        console.log(err);
        throw err;
    }
};

Answer.getById = async (id) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = `SELECT 
                            answers.id,
                            users.username AS user,
                            answers.question_id,
                            answers.content,
                            answers.created_at,
                            answers.updated_at
                        FROM answers 
                        LEFT JOIN questions ON 
                            answers.question_id = questions.id
                        LEFT JOIN users ON 
                            answers.user_id = users.id
                        WHERE answers.id = ?;`;
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

Answer.update = async (id,newData) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        
        
        const query = 'SELECT * FROM answers WHERE id = ?';

        const updateQuery =`UPDATE answers SET 
                                content = COALESCE(?, content)
                            WHERE id = ?`;

        const [results] = await con.execute(query,[id]);
        
        if(results.length === 0) {
            throw { message: 'not_found' };
        } else {
            con.execute(updateQuery, [newData.content, id], (err,data) => {
                if(err) throw err;
            });
        }

        await con.end();

    } catch (err) {

        console.log(err);
        throw err;
    }
};

Answer.delete = async (id) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = 'DELETE FROM answers WHERE id = ?';
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

Answer.getByQuestionId = async (question_id) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = `SELECT 
                            answers.id,
                            users.username AS user,
                            answers.question_id,
                            answers.content,
                            answers.created_at,
                            answers.updated_at
                        FROM answers 
                        LEFT JOIN questions ON 
                            answers.question_id = questions.id
                        LEFT JOIN users ON 
                            answers.user_id = users.id
                        WHERE questions.id = ?;`;
  
        const [results] = await con.execute(query, [question_id]);
  
        await con.end();
        return results;
  
    }  catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = Answer;