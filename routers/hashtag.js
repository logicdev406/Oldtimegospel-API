const router = require('express').Router();
const {
  listHashtags,
  createHashtag,
  updateHashtagById,
  fetchHashtagBySlug,
  deleteHashtagById
} = require('../controllers/HashtagController');

// List hashtag
router.get('/', listHashtags);

// List hashtag
router.get('/:slug', fetchHashtagBySlug);

// Create hashtag
router.post('/', createHashtag);

// Update hashtag by id
router.put('/:id', updateHashtagById);

// Delete hashtag by id
router.delete('/:id', deleteHashtagById);

module.exports = router;
