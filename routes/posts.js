const express = require('express');
const router = express.Router();
const passport = require('passport');
const postControllers = require('../controllers/posts_controller');
router.post('/create', passport.checkAuthentication, postControllers.create);
module.exports = router;