const router = require('express').Router();
const multer = require('multer');
const { memoryStorage } = require('multer');
const Storage = memoryStorage();
const upload = multer({ Storage });
const {
  listPosts,
  createPost,
  deletePostById,
  findPostBySlug
} = require('../controllers/PostController');

// List Posts endpoint
router.get('/', listPosts);
// Fetch post by slug
router.get('/:slug', findPostBySlug);
// Create post
router.post(
  '/',
  // upload.single('audio'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  createPost
);
// Delete post by id
router.delete('/:id', deletePostById);

module.exports = router;
