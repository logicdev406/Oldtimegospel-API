const router = require('express').Router();
const { createComment } = require('../controllers/CommentController');

// List comments
router.post('/:id', createComment);

module.exports = router;
