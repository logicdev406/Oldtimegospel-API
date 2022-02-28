const router = require('express').Router();
const {
  listUsers,
  createUser,
  updateUserById,
  loginUser,
  deleteUserById
} = require('../controllers/UserController');
const { authUser, isAdmin } = require('../helper/jwt');

// list users endpoint
router.get('/', [authUser, isAdmin], listUsers);

// Create user
router.post('/', createUser);

// Update user
router.put('/:id', [authUser], updateUserById);

// Login user
router.post('/login', loginUser);

// Delete user
router.delete('/:id', [authUser, isAdmin], deleteUserById);

module.exports = router;
