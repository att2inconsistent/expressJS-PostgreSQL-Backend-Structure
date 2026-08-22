const express = require('express')
const router = express.Router()
const {getSellerApplication, reviewApplication} = require('../controllers/admin.controller')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')

router.get('/seller-applications', authenticate, authorize('admin'), getSellerApplication)
router.patch('/seller-applications/:id', authenticate, authorize('admin'), reviewApplication)

module.exports=router