const pool = require('../../config/db')

async function createAssignment(sellerId, standId, assignedBy, db = pool) {
    const query={
        text:'INSERT INTO stand_assignments(seller_id, stand_id, assigned_by) VALUES ($1, $2, $3) RETURNING *',
        values:[sellerId, standId, assignedBy],
    }
    const res=await db.query(query)
    return res.rows[0]
}

async function getActiveAssignmentBySeller(sellerId) {
    const query={
        text:'SELECT * FROM stand_assignments WHERE seller_id = $1 AND status = \'active\'',
        values:[sellerId],
    }
    const res=await pool.query(query)
    return res.rows[0]
}

async function deactivateAssignment(assignmentId, db=pool) {
    const query={
        text:'UPDATE stand_assignments SET status = \'inactive\', unassigned_at = NOW() WHERE id = $1 RETURNING *',
        values:[assignmentId],
    }
    const res=await db.query(query)
    return res.rows[0]
}

async function getAssignmentByStand(standId) {
    const query={
        text:'SELECT * FROM stand_assignments WHERE stand_id = $1',
        values:[standId],
    }
    const res=await pool.query(query)
    return res.rows
}

module.exports={createAssignment, getActiveAssignmentBySeller, deactivateAssignment, getAssignmentByStand}