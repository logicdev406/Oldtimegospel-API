const router = require('express').Router();
const { listPosts } = require('../controllers/PostsController');

router.get('/', listPosts);

module.exports = router;
