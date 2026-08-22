const { application } = require("express");
const { getPendingApplications, updateApplicationStatus } = require("../db/queries/sellerApplication.queries");

async function getSellerApplication(req,res){
    try{
        const application= await getPendingApplications()
        return res.status(200).json({application})
    }catch{
        return res.status(500).json({message:'server error'})
    }
}

async function reviewApplication(req,res){
    try{
        const reviewId = req.params.id
        const { status } = req.body

        if (!['approved','rejected'].includes(req.body.status)){
            return res.status(400).json({error: status})
        }

        const updAppl = await updateApplicationStatus(reviewId, status, req.user.id)
        if(!updAppl){
            return res.status(404).json({message: 'application not found'})
        }
        return res.status(200).json({application: updAppl})
    }catch{
        return res.status(500).json({message:'server error'})
    }
}

module.exports={getSellerApplication, reviewApplication}