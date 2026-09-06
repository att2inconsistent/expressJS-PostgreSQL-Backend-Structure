const pool = require('../config/db');
const { createOrder, findOrderById, updateOrderStatus, getOrderByUser, getOrderByStand } = require('../db/queries/order.queries');
const { createOrderItem } = require('../db/queries/orderItem.queries');
const { findMenuItemById } = require('../db/queries/menu.queries');
const { getActiveAssignmentBySeller } = require('../db/queries/standAssignment.queries');

async function createOrderController(req,res,next) {
    const client = await pool.connect();
    try{
        const {standId, paymentMthd, delivMthd, delivAddr, items}=req.body

        let totalPrc=0
        const enrichedItems=[]

        for (const item of items){
            const productInfo = await findMenuItemById(item.menuItemId)
            if (!productInfo){
                return res.status(404).json({message: 'Menu item not found'})
            }
            const subTtl= Number(productInfo.price) * item.quantity
            totalPrc +=subTtl

            enrichedItems.push({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                priceAtOrder: productInfo.price
            })

        }
        await client.query('BEGIN')
        // return {enrichedItems, totalPrc}
        const createNewOrder=await createOrder(req.user.id, standId, paymentMthd, delivMthd, delivAddr, 0, totalPrc, client)

        for(const enrichedItem of enrichedItems){
            await createOrderItem(
                createNewOrder.id,
                enrichedItem.menuItemId,
                enrichedItem.quantity,
                enrichedItem.priceAtOrder,
                client
            )
        }

        await client.query('COMMIT')
        return res.status(201).json({order: createNewOrder})
    }catch(error){
        await client.query('ROLLBACK')
        next(error)
    }finally{
        client.release()
    }
}

async function updOrderStatusController(req,res,next) {
    try{
        const orderId=req.params.id
        const {status, rejectionReason}=req.body

        if (!['pending','accepted','preparing','ready','completed','rejected','cancelled'].includes(req.body.status)){
                return res.status(400).json({error: status})
        }

        const findOrderWithId=await findOrderById(orderId)
        if (findOrderWithId == null){
                return res.status(404).json({error:'order not found'})
        }
        const sellerActvAssgnmnt= await getActiveAssignmentBySeller(req.user.id)
        const hasNoAssignment= !sellerActvAssgnmnt
        const isDiffStand= sellerActvAssgnmnt && findOrderWithId.stand_id !== sellerActvAssgnmnt.stand_id
        if (hasNoAssignment || isDiffStand){
                return res.status(403).json({stand: 'order and stand do not match'})
        }
        const updOrderStat=await updateOrderStatus(status, rejectionReason, orderId)
        return res.status(200).json({order: updOrderStat})
    }catch(error){
        next(error)
    }
}

async function getOrdersByUserController(req,res,next) {
    try{
        const customerOrderId=req.user.id
        const getOrderWithUser = await getOrderByUser(customerOrderId)
        return res.status(200).json({order:getOrderWithUser})
    }catch(error){
        next(error)
    }
}

async function getOrderByStandController(req,res,next) {
    try{
        const sellerActvAssgnmnt= await getActiveAssignmentBySeller(req.user.id)
        const hasNoAssignment= !sellerActvAssgnmnt
        
        if (hasNoAssignment){
                return res.status(403).json({stand: 'user is not assigned to any stand'})
        }
        const ordersForStand=await getOrderByStand(sellerActvAssgnmnt.stand_id) 
        return res.status(200).json({order: ordersForStand})
    }catch(error){
        next(error)
    }
}

module.exports={createOrderController, updOrderStatusController,getOrdersByUserController, getOrderByStandController}