const pool=require('../../config/db')

async function  createMenuItem(standId, name, desc, qty, price){
    const query={
    text:'INSERT INTO menu_items(stand_id, name, description, quantity, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    values:[standId,name,desc,qty,price]
    }
    const res =await pool.query(query)
    return res.rows[0]
}

async function findMenuItemById(menuId){
    const query={
        text:'SELECT * FROM menu_items WHERE id = $1',
        values:[menuId]
    }
    const res = await pool.query(query)
    return res.rows[0]
}

async function getMenuItemByStand(standId) {
    const query={
        text:'SELECT * FROM menu_items WHERE stand_id = $1',
        values:[standId]
    }
    const res = await pool.query(query)
    return res.rows
}

async function updateMenuItem(name, desc, qty, price, isAvail,menuId){
    const query={
    text:'UPDATE menu_items SET name = $1, description = $2, quantity = $3, price = $4, is_available = $5 WHERE id = $6 RETURNING *',
    values:[name,desc,qty,price,isAvail,menuId]
    }
    const res =await pool.query(query)
    return res.rows[0]
}

async function deleteMenuItem(menuId) {
    const query={
        text:'DELETE FROM menu_items WHERE id = $1 RETURNING *',
        values:[menuId],
    }
    const res=await pool.query(query)
    return res.rows[0]
}

module.exports={createMenuItem,findMenuItemById, getMenuItemByStand, updateMenuItem, deleteMenuItem}