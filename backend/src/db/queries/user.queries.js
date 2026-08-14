const pool = require('../../config/db')

async function createUser(username, email, passwordHash,phoneNumber,role){
    const query = {
    text: 'INSERT INTO users(username, email, password_hash,phone_number,role) VALUES($1, $2, $3, $4, $5) RETURNING *',
    values: [username, email, passwordHash,phoneNumber,role],
    }

    const res = await pool.query(query)
    return res.rows[0]
}

async function findUserByEmail(email) {
    const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
    }
 
    const res = await pool.query(query)
    return res.rows[0]
}

module.exports = {createUser, findUserByEmail};