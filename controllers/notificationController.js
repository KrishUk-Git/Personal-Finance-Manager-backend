const RecurringTransaction = require('../models/RecurringTransaction');
const Goal = require('../models/Goal');
const moment = require('moment');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = [];
        const today = moment();
        const recurring = await RecurringTransaction.find({ user: req.user.id });
        recurring.forEach(item => {
            const nextDueDate = moment(item.lastCreatedDate || item.startDate).add(1, 'months');
            const daysUntilDue = nextDueDate.diff(today, 'days');
            if (daysUntilDue >= 0 && daysUntilDue <= 14) {
                notifications.push({
                    type: 'bill',
                    message: `Upcoming bill: ${item.description} for $${item.amount} is due around ${nextDueDate.format('MMM D')}.`
                });
            }
        });
        const goals = await Goal.find({ user: req.user.id });
        goals.forEach(goal => {
            if (goal.targetDate) {
                const daysUntilDeadline = moment(goal.targetDate).diff(today, 'days');
                if (daysUntilDeadline >= 0 && daysUntilDeadline <= 30) {
                     notifications.push({
                        type: 'goal',
                        message: `Goal deadline approaching: "${goal.name}" is due on ${moment(goal.targetDate).format('ll')}.`
                    });
                }
            }
        });
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

