const express = require('express');
const router = express.Router();
const {toggleStandOpenCotroller} = require('../controllers/seller.controller')
const authenticate = require('../middleware/authenticate')

router.patch('/stands/:id/toggle-open', authenticate, toggleStandOpenCotroller)


module.exports=router