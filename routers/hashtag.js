const router = require('express').Router();
const {
  listHashtags,
  createHashtag,
  updateHashtagById
} = require('../controllers/HashtagController');

// List hashtag
router.get('/', listHashtags);

// Create hashtag
router.post('/', createHashtag);

// Update hashtag by id
router.put('/:id', updateHashtagById);

module.exports = router;
