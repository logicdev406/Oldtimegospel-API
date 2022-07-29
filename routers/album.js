const router = require('express').Router();
const { listAlbums } = require('../controllers/AlbumController');
const { authUser, isAdmin } = require('../helper/jwt');
const Album = require('../models/Album');
const paginatedResults = require('../helper/PaginatedResult');

// list albums endpoint
router.get('/', paginatedResults(Album), listAlbums);

module.exports = router;
