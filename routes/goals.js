const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalController');

router.route('/').get(auth, getGoals).post(auth, addGoal);
router.route('/:id').put(auth, updateGoal).delete(auth, deleteGoal);

module.exports = router;
