const pool = require('../db'); // Import the database connection pool
const bcrypt = require('bcrypt');
class authmodel {
    static async signup(email , password , username , role){
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)`;
        const values = [email, hashedPassword, username, role];
        
        const [result] = await pool.execute(query, values);
        if (result.affectedRows > 0) {
            // Get the inserted user
            const [rows] = await pool.execute('SELECT id, email, username, role FROM users WHERE id = ?', [result.insertId]);
            return {
                id: rows[0].id,
                email: rows[0].email,
                username: rows[0].username,
                role: rows[0].role
            };
        }
        return null;
    } 

    static async findbyemail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.execute(query, [email]);
        if (rows.length > 0) {
            return rows[0];
        }
        return null;
    }

    static async get_students() {
        const query = 'SELECT id, email, username, role FROM users WHERE role = "student"';
        const [rows] = await pool.execute(query);
        return rows;
    }

    static async get_teachers() {
        const query = 'SELECT id, email, username, role FROM users WHERE role = "teacher"';
        const [rows] = await pool.execute(query);
        console.log(rows);
        return rows;
    }
}

module.exports = authmodel;