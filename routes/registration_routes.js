const express = require('express');

// Controllers
const registrationController = require('../controllers/registrationController');

const router = express.Router();

// Render Registration page
router.get('/registration', registrationController.register);

// Render signup page
router.get('/registration/email_signup', registrationController.signup);

// Render Login page
router.get('/registration/email_login', registrationController.getlogin);

// create a user with sign up
router.post('/registration/signup_processing', registrationController.signupProcessing);

router.get('/reset_password', registrationController.getReset);

router.post('/reset_password', registrationController.postReset);

router.get('/reset/:token', registrationController.getNewPassword);

router.post('/new_password', registrationController.postNewPassword);

module.exports = router;