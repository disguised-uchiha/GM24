const bcrypt = require('bcrypt');

//Models
const UserModel = require('../models/users');

exports.postloginToDashBoard = (req, res, next) => {
    const user_entered_email = req.body.email;
    const user_entered_pwd = req.body.pwd;
    //Fetching the user from database with the email they provided
    UserModel.findOne({ email: user_entered_email })
        .exec()
        .then((user) => {
            if (!user) {
                req.flash('error', 'Invalid email address');
                return res.redirect('/registration/email_login');
            }
            bcrypt.compare(user_entered_pwd, user.password, (err, doMatch) => {
                if (err) {
                    res.status(401).render('404', { message: 'Authentication Failed' });
                }
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        res.status(200).render('./dashboard/welcome', {
                            name: req.session.user.name,
                        });
                    });
                }
                else {
                    req.flash('error', 'Invalid Password');
                    res.redirect('/registration/email_login');
                    // console.log('login went wrong on /dashboard/welcome middleware');
                    // res.status(401).json({ message: "Auth failed" });
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err,
            });
        });
};

exports.getloginToDashBoard = (req, res, next) => {
    res.render('./dashboard/welcome', {
        name: req.session.user.name,
    });
};