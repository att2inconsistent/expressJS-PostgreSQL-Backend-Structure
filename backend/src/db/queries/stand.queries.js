const pool = require('../../config/db')

async function createStand(name, logoUrl, createdBy) {
    const query ={
        text:'INSERT INTO stands(name, logo_url, created_by) VALUES ($1, $2, $3) RETURNING *',
        values:[name, logoUrl,createdBy],
    }

    const res =await pool.query(query)
    return res.rows[0]
}

async function findStandBy(standId) {
    const query={
        text:'SELECT * FROM stands WHERE id = $1',
        values:[standId],
    }

    const res= await pool.query(query)
    return res.rows[0]
}

async function getAllStands() {
    const res=await pool.query('SELECT * FROM stands')
    return res.rows
}

async function updateStandOpenStatus(standId, isOpen, updatedBy) {
    const query={
        text:'UPDATE stands SET is_open = $1, status_updated_by = $2, status_updated_at = NOW() WHERE id = $3 RETURNING *',
        values:[isOpen, updatedBy, standId],
    }
    const res=await pool.query(query)
    return res.rows[0]
}

module.exports={createStand,findStandBy, getAllStands, updateStandOpenStatus}