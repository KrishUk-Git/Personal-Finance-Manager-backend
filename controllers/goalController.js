const Goal = require('../models/Goal');

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ targetDate: 1 });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addGoal = async (req, res) => {
  const { name, targetAmount, currentAmount, targetDate } = req.body;
  try {
    const newGoal = new Goal({ user: req.user.id, name, targetAmount, currentAmount, targetDate });
    const goal = await newGoal.save();
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateGoal = async (req, res) => {
  const { currentAmount } = req.body;
  try {
    let goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });
    if (goal.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    goal = await Goal.findByIdAndUpdate(req.params.id, { $set: { currentAmount } }, { new: true });
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });
    if (goal.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Goal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

