const bcrypt = require('bcrypt');

//Models
const UserModel = require('../models/users');
const TaskModel = require('../models/task');

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
                    let start = new Date();
                    start.setHours(0, 0, 0, 0);
                    let end = new Date();
                    end.setHours(23, 59, 59, 999);                
                    return req.session.save(err => {
                        TaskModel.find({ userId: user._id, "createdAt": { "$gte": start, "$lt": end }}).exec().then(user => {
                            taskList = user;
                            res.status(200).render('./dashboard/welcome', {
                                name: user.name,
                                streak: 25,
                                medals: 0,
                                tasks: taskList,
                                csrfToken: req.csrfToken()
                            });
                        });
                    });
                }
                else {
                    req.flash('error', 'Invalid Password');
                    res.redirect('/registration/email_login');
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
    const user = req.session.user;
    let taskList;
    let start = new Date();
    start.setHours(0, 0, 0, 0);
    let end = new Date();
    end.setHours(23, 59, 59, 999);
    TaskModel.find({ userId: user._id, "createdAt": { "$gte": start, "$lt": end }}).exec().then(user => {
        taskList = user;
        res.render('./dashboard/welcome', {
            name: user.name,
            streak: 25,
            medals: 0,
            tasks: taskList
        });
    });
};