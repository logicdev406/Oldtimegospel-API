const router = require('express').Router();
const {
  listUsers,
  createUser,
  updateUserById,
  loginUser,
  deleteUserById,
  findUserbyId
} = require('../controllers/UserController');
const { authUser, isAdmin } = require('../helper/jwt');

// list users endpoint
router.get('/', [authUser, isAdmin], listUsers);

// fetch user by id
router.get('/:id', [authUser], findUserbyId);

// Create user
router.post('/', createUser);

// Update user
router.put('/:id', [authUser], updateUserById);

// Login user
router.post('/login', loginUser);

// Delete user
router.delete('/:id', [authUser], deleteUserById);

module.exports = router;
