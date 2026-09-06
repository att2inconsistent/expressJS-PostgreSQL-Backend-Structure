    const pool=require('../config/db')
    const { getPendingApplications, updateApplicationStatus } = require("../db/queries/sellerApplication.queries")
    const {createStand, getAllStands} = require('../db/queries/stand.queries')
    const {createAssignment, getActiveAssignmentBySeller, deactivateAssignment} = require('../db/queries/standAssignment.queries')

    async function getSellerApplication(req,res,next){
        try{
            const application= await getPendingApplications()
            return res.status(200).json({application})
        }catch(error){
            next(error)
        }
    }

    async function reviewApplication(req,res,next){
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
        }catch(error){
            next(error)
        }
    }

    async function createStandController(req,res,next){
        try{
            const logoUrl = req.body.logoUrl
            const name= req.body.name
            const createdBy = req.user.id
            if(!name){
                return res.status(400).json({ error: 'Stand name is required' });
            }
            const createNewStand = await createStand(name, logoUrl, createdBy)
            return res.status(201).json({stand: createNewStand})
        }catch(error){
            next(error)
        }
    }

    async function listStandsController(req,res,next) {
        try{
            const callStands = await getAllStands()
            return res.status(200).json({stands: callStands})
        }catch(error){
            next(error)
        }
    }

    async function assignSellerController(req,res,next) {
        const client = await pool.connect()

        const {sellerId, standId} = req.body
        const assignedBy = req.user.id
        const existingAssignment = await getActiveAssignmentBySeller(sellerId)

        try{
            await client.query('BEGIN')
            if(existingAssignment)
            {
                await deactivateAssignment(existingAssignment.id, client)
            }
            const activateNewAssignment = await createAssignment(sellerId, standId, assignedBy, client)
            await client.query('COMMIT')
            return res.status(201).json({assignment: activateNewAssignment})
        }catch(error){
            await client.query('ROLLBACK')
            next(error)
        }finally{
            client.release()
        }
    }


    async function deactivateAssignmentController(req,res,next){
        try{
            const assignedTo = req.params.id
            const deactivatedAssignment =await deactivateAssignment(assignedTo)
            if(!deactivatedAssignment){
                return res.status(404).json({message:'asignment not found'})
            }
            return res.status(200).json({assignment: deactivatedAssignment})
        }catch(error){
            next(error)
        }
    }

    module.exports={getSellerApplication, reviewApplication, createStandController,listStandsController, assignSellerController, deactivateAssignmentController}