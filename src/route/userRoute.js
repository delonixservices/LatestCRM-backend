const express = require('express');
const router = express.Router();
const { userLogin, getUserDetails , createUser} = require('../controller/userController');

router.post('/create', createUser);
router.post('/login', userLogin);
router.get('/:id', getUserDetails);

module.exports = router;
