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
  fetchPostByHashtag
} = require('../controllers/PostController');
const { isAdmin, authUser } = require('../helper/jwt');
const paginatedResults = require('../helper/PaginatedResult');
const Post = require('../models/Post');

// List Posts
router.get('/', paginatedResults(Post), listPosts);

// List Posts comments
router.get('/comments/:id', featchPostComments);

// Fetch post by slug
router.get('/:slug', findPostBySlug);

// Fetch all post with the given hashtag slug
router.get('/hashtag/:slug', fetchPostByHashtag);

// Create post
router.post(
  '/',
  [authUser, isAdmin],
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  createPost
);

// Update post by id
router.post(
  '/update/:id',
  [authUser, isAdmin],
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  updatePostById
);

// Delete post by id
router.delete('/:id', [authUser, isAdmin], deletePostById);

module.exports = router;
