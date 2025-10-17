const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
    if (user.mfaEnabled && user.mfaSecret) {
      const code = speakeasy.totp({ secret: user.mfaSecret, encoding: 'base32' });
      await transporter.sendMail({
        from: `Finance Manager <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Your Login Verification Code',
        text: `Your two-factor authentication code is: ${code}`,
      });
      return res.json({ mfaRequired: true, userId: user.id });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.setupMFA = async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({ length: 20 });
        await User.findByIdAndUpdate(req.user.id, { mfaSecret: secret.base32, mfaEnabled: false });
        res.json({ msg: 'MFA setup initiated. Please verify to enable.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.verifyMFA = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.mfaSecret) return res.status(400).json({ msg: 'MFA not set up.' });
        const verified = speakeasy.totp.verify({ secret: user.mfaSecret, encoding: 'base32', token: code, window: 2 });
        if (verified) {
            await User.findByIdAndUpdate(req.user.id, { mfaEnabled: true });
            res.json({ msg: 'MFA enabled successfully.' });
        } else {
            res.status(400).json({ msg: 'Invalid code.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.verifyMFALogin = async (req, res) => {
    const { userId, code } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user || !user.mfaEnabled || !user.mfaSecret) return res.status(400).json({ msg: 'Invalid request.' });
        const verified = speakeasy.totp.verify({ secret: user.mfaSecret, encoding: 'base32', token: code, window: 2 });
        if (verified) {
            const payload = { user: { id: user.id } };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        } else {
            res.status(400).json({ msg: 'Invalid code.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

