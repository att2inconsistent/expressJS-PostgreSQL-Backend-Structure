const pool = require('../../config/db')

async function createPaymentProof(orderId, imgUrl) {
    const query={
        text:'INSERT INTO payment_proofs (order_id, image_url) VALUES ($1, $2) RETURNING *',
        values:[orderId, imgUrl],
    }
    const res = await pool.query(query)
    return res.rows[0]
}
async function getPaymentProofByOrder(orderId) {
    const query={
        text:'SELECT * FROM payment_proofs WHERE order_id = $1',
        values:[orderId]
    }
    const res = await pool.query(query)
    return res.rows[0]
}
async function updatePaymentProofStatus(status, reviewedBy, proofId){
    const query={
        text:'UPDATE payment_proofs SET status = $1, reviewed_by = $2, reviewed_at = NOW() WHERE id = $3 RETURNING *',
        values:[status,reviewedBy, proofId]
    }
    const res = await pool.query(query)
    return res.rows[0]
}
module.exports={createPaymentProof,getPaymentProofByOrder,updatePaymentProofStatus}