const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
app.use(express.json());

const pool = require('./config/db');

app.use('/auth', authRoutes)


app.get('/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('DB Connected:', result.rows[0]);
        res.json({ message: 'Database connection successful', time: result.rows[0] });
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ message: 'Database connection failed', error: error.message });
    }
})

module.exports = app;