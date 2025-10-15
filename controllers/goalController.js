const Goal = require('../models/Goal');

// @desc    Get all financial goals for a user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ deadline: 1 });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new financial goal
exports.addGoal = async (req, res) => {
  const { name, targetAmount, currentAmount, deadline } = req.body;
  try {
    const newGoal = new Goal({
      user: req.user.id,
      name,
      targetAmount,
      currentAmount,
      deadline,
    });
    const goal = await newGoal.save();
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a financial goal (e.g., add to savings)
exports.updateGoal = async (req, res) => {
  const { currentAmount } = req.body;
  try {
    let goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $set: { currentAmount } },
      { new: true }
    );
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a financial goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Goal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
