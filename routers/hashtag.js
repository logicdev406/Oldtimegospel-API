const router = require('express').Router();
const {
  listHashtags,
  createHashtag
} = require('../controllers/HashtagController');

// List hashtag
router.get('/', listHashtags);

// Create hashtag
router.post('/', createHashtag);

module.exports = router;
