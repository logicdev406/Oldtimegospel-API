const router = require('express').Router();
const multer = require('multer');
const { memoryStorage } = require('multer');
const Storage = memoryStorage();
const upload = multer({ Storage });
const {
  listMusics,
  createMusic,
  deleteMusicById,
  findMusicBySlug,
  featchMusicComments,
  updateMusicById,
  fetchMusicByHashtag
} = require('../controllers/MusicController');
const { isAdmin, authUser } = require('../helper/jwt');
const paginatedResults = require('../helper/PaginatedResult');
const Music = require('../models/Music');

// List Musics
router.get('/', paginatedResults(Music), listMusics);

// List Musics comments
router.get('/comments/:id', featchMusicComments);

// Fetch music by slug
router.get('/:slug', findMusicBySlug);

// Fetch all music with the given hashtag slug
router.get('/hashtag/:slug', fetchMusicByHashtag);

// Create music
router.post(
  '/',
  [authUser, isAdmin],
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  createMusic
);

// Update music by id
router.post(
  '/update/:id',
  [authUser, isAdmin],
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  updateMusicById
);

// Delete music by id
router.delete('/:id', [authUser, isAdmin], deleteMusicById);

module.exports = router;
