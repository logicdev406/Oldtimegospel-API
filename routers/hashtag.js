const router = require('express').Router();
const {
  listHashtags,
  createHashtag,
  updateHashtagById,
  fetchHashtagBySlug,
  deleteHashtagById
} = require('../controllers/HashtagController');
const { isAdmin, authUser } = require('../helper/jwt');

// List hashtag
router.get('/', listHashtags);

// List hashtag
router.get('/:slug', fetchHashtagBySlug);

// Create hashtag
router.post('/', [authUser, isAdmin], createHashtag);

// Update hashtag by id
router.put('/:id', [authUser, isAdmin], updateHashtagById);

// Delete hashtag by id
router.delete('/:id', [authUser, isAdmin], deleteHashtagById);

module.exports = router;
