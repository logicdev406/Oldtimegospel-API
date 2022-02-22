const router = require('express').Router();
const {
  listUsers,
  createUser,
  updateUserById
} = require('../controllers/UsersController');

// list users endpoint
router.get('/', listUsers);

// Create user
router.post('/', createUser);

// Update user
router.post('/:id', updateUserById);

module.exports = router;
