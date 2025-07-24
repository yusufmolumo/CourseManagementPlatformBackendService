const express = require('express');
const router = express.Router();
const controller = require('../controllers/activityTrackerController');
const { authenticate, authorize } = require('../middlewares/auth');

// Facilitators can create/update/delete their own logs
router.post('/', authenticate, authorize('facilitator'), controller.create);
router.put('/:id', authenticate, authorize('facilitator', 'manager'), controller.update);
router.delete('/:id', authenticate, authorize('facilitator', 'manager'), controller.remove);

// All authenticated users can view, but facilitators only see their own
router.get('/', authenticate, controller.getAll);
router.get('/:id', authenticate, controller.getById);

module.exports = router; 