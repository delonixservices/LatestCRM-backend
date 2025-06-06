const express = require('express');
const router = express.Router();
const {protect ,isAdmin} = require('../middleware/auth');
const {loginUser, getUserDetails , createUser} = require('../controller/userController');
    // const validateData = require('../middleware/uservalidation');

router.post('/create', createUser);
router.post('/login', loginUser);
router.get('/mydata',protect, getUserDetails);
module.exports = router;
