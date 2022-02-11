const router = require('express').Router();
const {
  listPosts,
  createPost,
  findPostById
} = require('../controllers/PostController');

router.get('/', listPosts);
router.get('/:id', findPostById);
router.post('/', createPost);

module.exports = router;
