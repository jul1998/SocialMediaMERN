const express = require('express');
const router = express.Router();
const {
    addRemoveFriend,
    getUser,
    getUserFriends
} = require('../controllers/users');
const { verifyToken } = require('../middleware/auth');

router.get('/:id', verifyToken, getUser);
router.get('/friends/:userId', verifyToken, getUserFriends);
router.put('/add-remove-friend/:id', verifyToken, addRemoveFriend);

module.exports = router;