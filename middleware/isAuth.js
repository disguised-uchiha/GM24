module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/registration/email_login');
    }
    next();
}