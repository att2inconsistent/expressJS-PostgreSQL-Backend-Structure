const express = require('express')
const router = express.Router()
const {getSellerApplication, reviewApplication, createStandController, listStandsController, assignSellerController, deactivateAssignmentController} = require('../controllers/admin.controller')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')

router.get('/seller-applications', authenticate, authorize('admin'), getSellerApplication)
router.patch('/seller-applications/:id', authenticate, authorize('admin'), reviewApplication)

router.post('/stands', authenticate, authorize('admin'), createStandController)
router.get('/stands', authenticate, authorize('admin'), listStandsController)
router.post('/assign', authenticate, authorize('admin'),assignSellerController)
router.patch('/stand-assignments/:id/deactivate', authenticate,authorize('admin'),deactivateAssignmentController)



module.exports=router