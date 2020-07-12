const crypto = require('crypto');

// Third party packages
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

//Models
const UserModel = require('../models/users');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
    })
)

exports.register = (req, res, next) => {
    res.render('registration');
};

exports.signup = (req, res, next) => {
    res.render('email_signup');
};

exports.getlogin = (req, res, next) => {
    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    }
    else {
        errorMessage = null;
    }
    res.render('email_login', {
        errorMessage: errorMessage
    });
};

exports.getReset = (req, res, next) => {
    let feedbackMessage = req.flash('feedback');
    if (feedbackMessage.length > 0) {
        feedbackMessage = feedbackMessage[0];
    }
    else {
        feedbackMessage = null;
    }
    res.render('reset_password', {
        feedbackMessage: feedbackMessage
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset_password')
        }
        const token = buffer.toString('hex');
        UserModel.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('feedback', 'No Account with that email found.');
                    return res.redirect('/reset_password');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            }).then(result => {
                req.flash('feedback', 'Reset Link sent to your email');
                res.redirect('/reset_password');
                // TODO: Update forget password href to newlink
                return transporter.sendMail({
                    to: req.body.email,
                    from: 'harsh.boricha2015@gmail.com',
                    subject: 'Password Reset link for GM24',
                    html: `
                        <p>You requested a password reset </p>
                        <p> Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password </p>
                    `
                });
            })
    });
}

// This will take the token from the link user received in email & render update password view.
exports.getNewPassword = (req, res, next) => {
    // The token is extracted through URL  
    const token = req.params.token;
    // Find the user with the same tokenID and before expirationDate.
    UserModel.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            res.render('new_password', {
                userId: user._id.toString(),
                passwordToken: token
            });
        })
};

exports.postNewPassword = (req, res, next) => {
    const passwordToken = req.body.passwordToken;
    const userId = req.body.userId;
    const newPassword = req.body.newPassword;
    let resetUser;
    UserModel.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/registration/email_login')
        })
        .catch(err => console.log(err));
}

// This controller will take care of the signing in process and redirect to login page.
exports.signupProcessing = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const pwd = req.body.pwd;
    // Check if user email already exist if it exist then return the message.
    UserModel.find({ email: email })
        .exec()
        .then((user) => {
            // Basic email authentication if the user already exist
            if (user.length >= 1) {
                return res.render('404', {
                    message: 'Email already Used'
                })
            }
            // Encrypting the password that user entered 
            bcrypt.hash(pwd, 10).then(hashedPassword => {
                const user = new UserModel({
                    name: name,
                    email: email,
                    password: hashedPassword
                });
                return user.save();
            })
                .then(result => {
                    res.redirect('/registration/email_login');
                    // Email for successful signup
                    return transporter.sendMail({
                        to: email,
                        from: 'harsh.boricha2015@gmail.com',
                        subject: 'Signup succeeded!',
                        html: `<h1>You successfully signed up mortal.</h1>`
                    })
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
};