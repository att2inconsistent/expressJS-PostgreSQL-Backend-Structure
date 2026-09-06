const { getActiveAssignmentBySeller } = require("../db/queries/standAssignment.queries")
const { updateStandOpenStatus } = require("../db/queries/stand.queries")


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

module.exports={toggleStandOpenCotroller}