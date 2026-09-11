const express = require('express');
const router = express.Router();
const {toggleStandOpenCotroller, getMyApplicationController} = require('../controllers/seller.controller')
const authenticate = require('../middleware/authenticate')

router.patch('/stands/:id/toggle-open', authenticate, toggleStandOpenCotroller)
router.get('/my-application', authenticate, getMyApplicationController)

module.exports=router