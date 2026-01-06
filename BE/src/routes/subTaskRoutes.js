const express = require('express');
const router = express.Router();
const subtaskController = require('../controllers/subtaskController');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.post('/', subtaskController.createSubtask);          
router.get('/:taskId', subtaskController.getSubtasksByTask);
router.put('/:id', subtaskController.updateSubtask);       
router.delete('/:id', subtaskController.deleteSubtask); 

module.exports = router;