const pool = require('../../config/db')

async function createOrderItem(orderId, menuItemId, qty, priceAtOrder, db=pool) {
    const query={
        text:'INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_order) VALUES ($1, $2, $3, $4) RETURNING *',
        values:[orderId, menuItemId,qty, priceAtOrder],
    }
    const res = await db.query(query)
    return res.rows[0]
}

async function getItemsByOrder(orderId) {
    const query={
        text:'SELECT * FROM order_items WHERE order_id = $1',
        values:[orderId]
    }
    const res = await pool.query(query)
    return res.rows
}

module.exports={createOrderItem,getItemsByOrder}