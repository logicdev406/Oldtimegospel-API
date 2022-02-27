const router = require('express').Router();
const multer = require('multer');
const { memoryStorage } = require('multer');
const Storage = memoryStorage();
const upload = multer({ Storage });
const {
  listPosts,
  createPost,
  deletePostById,
  findPostBySlug,
  featchPostComments,
  updatePostById,
  fetchPostByHashtagSlug
} = require('../controllers/PostController');

// List Posts
router.get('/', listPosts);

// List Posts comments
router.get('/comments/:id', featchPostComments);

// Fetch post by slug
router.get('/:slug', findPostBySlug);

// Fetch all post with the given hashtag slug
router.get('/hashtag/:slug', fetchPostByHashtagSlug);

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

// Update post by id
router.put(
  '/update/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  updatePostById
);

// Delete post by id
router.delete('/:id', deletePostById);

module.exports = router;
