const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/auth.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize')

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, (req,res)=>{
    res.json({user: req.user})
})

module.exports=router;