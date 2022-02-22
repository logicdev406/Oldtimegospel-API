const router = require('express').Router();
const { listUsers, createUser } = require('../controllers/UsersController');

// list users endpoint
router.get('/', listUsers);

// Create user
router.post('/', createUser);

module.exports = router;
