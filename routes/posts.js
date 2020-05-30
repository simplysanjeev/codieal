const express = require('express');
const router = express.Router();

const postControllers = require('../controllers/posts_controller');
router.post('/create', postControllers.create);
module.exports = router;