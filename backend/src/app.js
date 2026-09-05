const express = require('express');
const app = express();
const helmet = require('helmet');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const sellerRoutes= require('./routes/seller.routes');
const menuRoutes= require('./routes/menu.routes');
const orderRoutes= require('./routes/order.routes');
const paymentRoutes= require('./routes/payment.routes');
const limiter = require('./middleware/rateLimiter');
app.use(helmet())
app.use(express.json());
app.use(limiter);

const pool = require('./config/db');

app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/seller', sellerRoutes)
app.use('/menu', menuRoutes)
app.use('/order', orderRoutes)
app.use('/payment', paymentRoutes)

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