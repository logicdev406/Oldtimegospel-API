const router = require('express').Router();
const {
  listUsers,
  createUser,
  updateUserById,
  loginUser
} = require('../controllers/UsersController');

// list users endpoint
router.get('/', listUsers);

// Create user
router.post('/', createUser);

// Update user
router.post('/:id', updateUserById);

// Login user
router.post('/login', loginUser);

module.exports = router;
