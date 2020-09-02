const express = require('express');
const dotenv = require('dotenv');
const connecetDB = require('./config/db');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport')
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const methodOverride = require('method-override');

//load config 
dotenv.config({ path: './config/config.env' });

//passport config
require('./config/passport')(passport);
//connecet to Db
connecetDB();

const app = express();

//body parser
app.use(express.urlencoded({ extended: false }));//form data
app.use(express.json());

//method override 
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

//loggin
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
//handle bar helper
const { formatDate, stripTags, truncate, editIcon , select} = require('./helpers/hbs')


//handlebar
app.engine('.hbs', exphbs({ helpers: { formatDate, stripTags, truncate, editIcon , select}, defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');


//sesstions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global ver
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
})
//Static folder
app.use(express.static(path.join(__dirname, 'public')));


//routes
app.use('/', require('./route/index'));
app.use('/auth', require('./route/auth'));
app.use('/stories', require('./route/stories'))



const PORT = process.env.PORT || 5000;
app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
