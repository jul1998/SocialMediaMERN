const express = require('express');

const { getFeedPosts, getUserPosts, likePost, createPost} = require('../controllers/posts');

const { verifyToken } = require('../middleware/auth');

const router = express.Router();

//Read

router.get('/', verifyToken, getFeedPosts);
router.get('/:userId/posts', verifyToken, getUserPosts);

//Update
router.patch('/:id/like', verifyToken, likePost);

//Create
router.post('/create-post', createPost);

module.exports = router;