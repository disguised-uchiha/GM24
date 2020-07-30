const express = require('express');
const router = express.Router();

// Models
const TaskModel = require('../models/task');
const UserModel = require('../models/users');

// Routes
const dashboardController = require('../controllers/dashboardController');

// Middlewares
const isAuth = require('../middleware/isAuth');

// This route works when user click on login through email_login 
router.post('/dashboard/welcome', dashboardController.postloginToDashBoard);

// after task submission we redirect user to the welcome page again.
router.get('/dashboard/welcome', isAuth, dashboardController.getloginToDashBoard);

router.post('/dashboard/add_daily_goal_1', isAuth, (req, res, next) => {
    res.render('./dashboard/add_daily_goal_1');
});

router.post('/dashboard/add_daily_goal_2', isAuth, (req, res, next) => {
    res.render('./dashboard/add_daily_goal_2', {
        goalType: req.body.goal_type,
    });
});

// save task to DB and redirect to dashboard.
router.post('/dashboard/save_task', (req, res, next) => {
    const user = req.session.user;
    // Destructuring the data into variables with same name as that defined in schema
    let { goal_type: goalType, task_name: goalName, purpose: goalPurpose, select_icon: goalIcon, times_per_day: goalRepeatNo } = req.body;
    // Imp coz goalType in models given as default will not work since the value itself is ''.
    if (goalType === '') {
        goalType = 'personal_goal';
    }
    let task = new TaskModel({
        goalType,
        goalName,
        goalRepeatNo,
        goalPurpose,
        goalIcon,
        userId: user,
    });
    task.save();
    res.redirect('/dashboard/welcome');
});

router.get('/task/:taskId', (req, res, next) => {
    const taskId = req.params.taskId;
    TaskModel.findById(taskId).then(task => {
        res.render('./dashboard/task_detail', {
            taskId: task.id,
            taskName: task.goalName,
            taskType: task.goalType,
            taskIcon: task.goalIcon,
            taskPurpose: task.goalPurpose,
            taskRepetition: task.goalRepeatNo,
        });
    }).catch(err => console.log(err))
});

// router.post('/dashboard/logout', (req, res, next) => {
//     req.session.destroy(err => {
//         err ? console.log(err) : res.redirect('/registration/email_login');
//     });
// });

module.exports = router;