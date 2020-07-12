const express = require('express');

const router = express.Router();

// Routes
const dashboardController = require('../controllers/dashboardController');

// Middlewares
const isAuth = require('../middleware/isAuth');

router.post('/dashboard/welcome', dashboardController.postloginToDashBoard);

router.get('/dashboard/welcome', isAuth, dashboardController.getloginToDashBoard);

router.get('/dashboard/create_habit', isAuth, (req, res, next) => {
    res.render('./dashboard/create_habit', {
        message: 'create habit'
    });
});

router.get('/dashboard/rpd', isAuth, (req, res, next) => {
    res.render('./dashboard/rpd')
});

router.post('/dashboard/logout', (req, res, next) => {
    req.session.destroy(err => {
        err ? console.log(err) : res.redirect('/registration/email_login');
    });
});

module.exports = router;