const { getActiveAssignmentBySeller } = require("../db/queries/standAssignment.queries")
const { updateStandOpenStatus } = require("../db/queries/stand.queries")
const { findApplicationByUserId } = require('../db/queries/sellerApplication.queries')


async function toggleStandOpenCotroller(req,res,next) {
    try{
        const standId= req.params.id
        const {isOpen}= req.body

        const activeSellerAssignment=await getActiveAssignmentBySeller(req.user.id)
        const convertedString = Number(standId)

        const hasNoAssignment= !activeSellerAssignment
        const isDiffStand=activeSellerAssignment && activeSellerAssignment.stand_id !==convertedString

        if (isDiffStand || hasNoAssignment){
            return res.status(403).json({stand:'not permitted'})
        }else{
            const updStandStat=await updateStandOpenStatus(standId, isOpen, req.user.id)
            return res.status(200).json({stand: updStandStat})
        }

    }catch(error){
        next(error)
    }
}

async function getMyApplicationController(req, res, next){
        try{
            const userId=req.user.id
            const myApplication= await findApplicationByUserId(userId)
            if(!myApplication){
                return res.status(404).json({message: 'application not found'})
            }
            return res.status(200).json({application: myApplication})
        }catch(error){
            next(error)
        }
    }

async function getMyAssignmentController(req, res, next) {
    try {
        const assignment = await getActiveAssignmentBySeller(req.user.id);
        if (!assignment) {
            return res.status(404).json({ message: 'No active assignment found' });
        }
        return res.status(200).json({ assignment });
    } catch (error) {
        next(error);
    }
}

module.exports={toggleStandOpenCotroller, getMyApplicationController, getMyAssignmentController}