const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/userController');

router.route('/profile').get(auth, getProfile).put(auth, updateProfile);

module.exports = router;
