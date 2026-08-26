const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { deleteMenuItemController, updateMenuItemController, createMenuItemController, getMenuItemController } = require('../controllers/menu.controller');
const router = express.Router();

router.get('/:standId', getMenuItemController)
router.post('/', authenticate, authorize('seller'), createMenuItemController)
router.patch('/:id', authenticate, authorize('seller'), updateMenuItemController)
router.delete('/:id', authenticate, authorize('seller'), deleteMenuItemController)


module.exports=router