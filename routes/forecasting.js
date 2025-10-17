const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getForecast } = require('../controllers/forecastingController');

router.get('/', auth, getForecast);

module.exports = router;

