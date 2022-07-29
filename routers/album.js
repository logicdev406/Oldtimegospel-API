const router = require('express').Router();
const {
  listAlbums,
  findAlbumBySlug,
  createAlbum
} = require('../controllers/AlbumController');
const multer = require('multer');
const { memoryStorage } = require('multer');
const Storage = memoryStorage();
const upload = multer({ Storage });
const { authUser, isAdmin } = require('../helper/jwt');
const Album = require('../models/Album');
const paginatedResults = require('../helper/PaginatedResult');

// list albums endpoint
router.get('/', paginatedResults(Album), listAlbums);

// Fetch album by slug
router.get('/:slug', findAlbumBySlug);

// Create album
router.post(
  '/',
  [authUser, isAdmin],
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'tracks', maxCount: 20 }
  ]),
  createAlbum
);

module.exports = router;
