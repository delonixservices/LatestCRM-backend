const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {loginUser, getUserDetails , createUser} = require('../controller/userController');

router.post('/create',createUser);
router.post('/login', loginUser);
router.get('/:id', getUserDetails);

module.exports = router;
