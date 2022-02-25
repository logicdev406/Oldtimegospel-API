const router = require('express').Router();
const { listHashtags } = require('../controllers/HashtagController');

// List comments
router.post('/:id', listHashtags);

module.exports = router;
