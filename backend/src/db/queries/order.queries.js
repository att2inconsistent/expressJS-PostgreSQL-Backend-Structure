const pool = require('../../config/db')

async function createOrder(userId, StandId, paymentMthd, delivMthd, delivAddr, delivFee, ttlPrice, db=pool) {
    const query={
        text:'INSERT INTO orders (user_id, stand_id, payment_method, delivery_method, delivery_address, delivery_fee, total_price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        values:[userId, StandId, paymentMthd, delivMthd, delivAddr, delivFee, ttlPrice],
    }
    const res = await db.query(query)
    return res.rows[0]
}

async function findOrderById(orderId) {
    const query={
        text:'SELECT * FROM orders WHERE id = $1',
        values:[orderId]
    }
    const res = await pool.query(query)
    return res.rows[0] 
}

async function getOrderByUser(userId) {
    const query={
        text:'SELECT * FROM orders WHERE user_id = $1',
        values:[userId]
    }
    const res = await pool.query(query)
    return res.rows
}

async function getOrderByStand(standId) {
    const query={
        text:'SELECT * FROM orders WHERE stand_id = $1',
        values:[standId]
    }
    const res = await pool.query(query)
    return res.rows
}

async function updateOrderStatus( status, rejectionReason=null, orderId) {
    const query={
        text:'UPDATE orders SET status = $1, rejection_reason = $2 WHERE id = $3 RETURNING *',
        values:[status,rejectionReason, orderId]
    }
    const res = await pool.query(query)
    return res.rows[0]
}

module.exports={createOrder, findOrderById, getOrderByUser, getOrderByStand, updateOrderStatus}