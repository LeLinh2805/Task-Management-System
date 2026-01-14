const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.post('/', commentController.createComment);
router.get('/:taskId', commentController.getCommentsByTask);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;