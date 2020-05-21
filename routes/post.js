const express = require('express');
const router = express.Router();

const postController = require('../controllers/post_controller');

router.get('/', postController.post);
router.get('/delete-post', postController.deletePost);

module.exports = router;