const { createMenuItem, getMenuItemByStand, findMenuItemById, updateMenuItem, deleteMenuItem } = require("../db/queries/menu.queries")
const { getActiveAssignmentBySeller } = require("../db/queries/standAssignment.queries")


async function getMenuItemController(req,res){
    try{
        const standId = req.params.standId
        const callMenuItemByStand = await getMenuItemByStand(standId)
        return res.status(200).json({stand: callMenuItemByStand})
    }catch{
        return res.status(500).json({message:'server error'})
    }
}

async function createMenuItemController(req,res) {
    try{
        const getAssignmentBySeller= await getActiveAssignmentBySeller(req.user.id)
        if (!getAssignmentBySeller){
            return res.status(403).json({assignment: 'user does not have permission'})
        }
        const {name, desc, qty, price}=req.body
        const crtMenuItem=await createMenuItem(getAssignmentBySeller.stand_id, name,desc,qty,price)
        return res.status(200).json({item: crtMenuItem})
    }catch{
        return res.status(500).json({message:'server error'})
    }
}

async function updateMenuItemController(req,res) {
    try{
        const itemId = req.params.id
        const findMenuWithId=await findMenuItemById(itemId)
        if (findMenuWithId == null){
            return res.status(404).json({error:'item is not found'})
        }
        const sellerActvAssgnmnt= await getActiveAssignmentBySeller(req.user.id)
        const hasNoAssignment= !sellerActvAssgnmnt
        const isDiffStand= sellerActvAssgnmnt && findMenuWithId.stand_id !== sellerActvAssgnmnt.stand_id

        if (hasNoAssignment || isDiffStand){
            return res.status(403).json({stand: 'item and stand do not match'})
        }else{
            const updatedOne = req.body
            const updatedMenuItem =await updateMenuItem(updatedOne.name, updatedOne.desc, updatedOne.qty, updatedOne.price, updatedOne.isAvail, itemId)
            return res.status(200).json({item: updatedMenuItem})
        }
    }catch{
        return res.status(500).json({message:'server error'})
    }
}

async function deleteMenuItemController(req,res) {
    try{
        const itemId = req.params.id
        const findMenuWithId=await findMenuItemById(itemId)
        if (findMenuWithId == null){
            return res.status(404).json({error:'item is not found'})
        }
        const sellerActvAssgnmnt= await getActiveAssignmentBySeller(req.user.id)
        const hasNoAssignment= !sellerActvAssgnmnt
        const isDiffStand= sellerActvAssgnmnt && findMenuWithId.stand_id !== sellerActvAssgnmnt.stand_id

        if (hasNoAssignment || isDiffStand){
            return res.status(403).json({stand: 'item and stand do not match'})
        }else{
            const deletedMenuItem =await deleteMenuItem(itemId)
            return res.status(200).json({item: deletedMenuItem})
        }
    }catch{
        return res.status(500).json({message:'server error'})
    }
}

module.exports={getMenuItemController,createMenuItemController,updateMenuItemController,deleteMenuItemController}