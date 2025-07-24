const express = require('express');
const router = express.Router();
const controller = require('../controllers/courseOfferingController');
const { authenticate, authorize } = require('../middlewares/auth');

// Only managers can create, update, delete
router.post('/', authenticate, authorize('manager'), controller.create);
router.put('/:id', authenticate, authorize('manager'), controller.update);
router.delete('/:id', authenticate, authorize('manager'), controller.remove);

// All authenticated users can view, but facilitators only see their own
router.get('/', authenticate, controller.getAll);
router.get('/:id', authenticate, controller.getById);

module.exports = router; 