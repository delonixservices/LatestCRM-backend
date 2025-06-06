const express = require('express');
const router = express.Router();
const { createRole } = require('../controller/roleController');

router.post('/create',  createRole);

module.exports = router;
