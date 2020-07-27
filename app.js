require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');

// Routes
const reg_routes = require('./routes/registration_routes');
const dashboard_routes = require('./routes/dashboard_routes');

// URI for MongoDB & MongoDBStore
const uri =
    `mongodb+srv://harsh:${process.env.MONGODB_PWD}@cluster0.mta9e.mongodb.net/GM24?retryWrites=true&w=majority`;

const app = express();

// Setting up the MongoDBStore for sessions package
const store = new MongoDBStore({
    uri: uri
});
// Setting up the templating engine
app.set('view engine', 'ejs');
app.set('views', 'views');


// All request must include this
app.use(helmet());
app.use(compression());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 3600000*24*2 },//expires in 2 days
    resave: false,
    saveUninitialized: false,
    store: store,
}));
// Setup sessions and store them into your database using MongoDBStore
app.use(csrf());
app.use(flash());

// Routing requests
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(),
    next();
});
app.get('/', (req, res, next) => {
    res.render('index');
});
app.use(reg_routes);
app.use(dashboard_routes);
app.use((req, res, next) => {
    return res.status(404).render('404', {
        message: '404 Error occured',
    });
});
// Added useCreateIndex to remove the deprecation warning.
mongoose.set('useCreateIndex', true);

// Connecting to MongoDB using mongoose
mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => app.listen(process.env.PORT || 3000, () => console.log('connected to 3000'))
    )
    .catch(err => console.log(err));