const router = require('express').Router();
const multer = require('multer');
const { memoryStorage } = require('multer');
const Storage = memoryStorage();
const upload = multer({ Storage });
const {
  listPosts,
  createPost,
  findPostById,
  deletePostById
} = require('../controllers/PostController');

router.get('/', listPosts);
router.get('/:id', findPostById);
router.post(
  '/',
  // upload.single('audio'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  createPost
);
router.delete('/:id', deletePostById);

module.exports = router;
