const mysql = require('mysql2/promise');
const mysqlConfig = require('../config/db.config');

const Category = function(category) {
    this.id = category.id;
    this.category = category.category;
};

Category.create = async (newCategory, result) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = 'INSERT INTO categories SET ?';

        con.query(query,newCategory, (err,res) => {
            if(err) {
                console.log('error:', err);
                result(err, null);
                return;
            }

            console.log('Created category', { id: res.insertId, ...newCategory});
            result(null, { id: res.insertId, ...newCategory});
        });

        await con.end();

    } catch (err) {
        console.log(err);
        throw err;
    }
};

Category.getAll = async () => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        let query = 'SELECT * FROM categories';
        const [results] = await con.execute(query);

        await con.end();
        return results;

    } catch (err) {

        console.log(err);
        throw err;
    }
};

Category.getById = async (id) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = `SELECT *
                        FROM categories 
                        WHERE id = ?`;
        const [results] = await con.execute(query,[id]);
    
        if (!results.length) {
            throw { message: 'not_found' };
        }

        await con.end();
        return results;

    } catch (err) {

        console.log(err);
        throw err;
    }
};

Category.update = async (id, newData) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = 'SELECT * FROM categories WHERE id = ?';

        const updateQuery =`UPDATE categories SET 
                                category = COALESCE(?, category)
                            WHERE id = ?`;

        const [results] = await con.execute(query,[id]);
        
        if(results.length === 0) {
            throw { message: 'not_found' };
        } else {
            con.execute(updateQuery, [
                newData.category,
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

Category.delete = async (id) => {
    try {
        const con = await mysql.createConnection(mysqlConfig);
        const query = 'DELETE FROM categories WHERE id = ?';

        const [results] = await con.execute(query, [id]);
        
        if (results.affectedRows === 0) {
            throw { message: 'not_found' };
        }
    } catch (err) {

        console.log(err);
        throw err;
    }
};

module.exports = Category;