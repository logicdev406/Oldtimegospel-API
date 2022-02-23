const router = require('express').Router();
const {
  listUsers,
  createUser,
  updateUserById,
  loginUser,
  deleteUserById
} = require('../controllers/UserController');

// list users endpoint
router.get('/', listUsers);

// Create user
router.post('/', createUser);

// Update user
router.put('/:id', updateUserById);

// Login user
router.post('/login', loginUser);

// Delete user
router.delete('/:id', deleteUserById);

module.exports = router;
