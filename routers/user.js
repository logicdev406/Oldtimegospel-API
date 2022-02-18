const router = require('express').Router();
const { listUsers } = require('../controllers/UsersController');

// list users endpoint
router.get('/', listUsers);

module.exports = router;
