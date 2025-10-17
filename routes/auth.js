const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getLoggedInUser, setupMFA, verifyMFA, verifyMFALogin } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', auth, getLoggedInUser);
router.post('/mfa/setup', auth, setupMFA);
router.post('/mfa/verify', auth, verifyMFA);
router.post('/mfa/verify-login', verifyMFALogin);

module.exports = router;

