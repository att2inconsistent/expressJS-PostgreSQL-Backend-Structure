const pool = require('../config/db');
const { createOrder } = require('../db/queries/order.queries');
const { createOrderItem } = require('../db/queries/orderItem.queries');
const { findMenuItemById } = require('../db/queries/menu.queries');

async function createOrderController(req,res) {
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
        console.error(error);
        return res.status(500).json({message:'server error'})
    }finally{
        client.release()
    }
}



module.exports={createOrderController}