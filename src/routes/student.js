const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentController');
const { authenticate, authorize } = require('../middlewares/auth');

router.post('/', authenticate, authorize('manager'), controller.create);
router.get('/', authenticate, controller.getAll);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', authenticate, authorize('manager'), controller.update);
router.delete('/:id', authenticate, authorize('manager'), controller.remove);

module.exports = router;