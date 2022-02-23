const router = require('express').Router();
const { listPosts } = require('../controllers/PostController');

// List comments
router.get('/', listPosts);
