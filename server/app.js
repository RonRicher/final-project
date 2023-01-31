var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var usersRouter = require('./routes/users');
var companiesRouter = require('./routes/company');
var companiesDataRouter = require('./routes/companiesData');
var companiesDealsRouter = require('./routes/companiesDeals');
var usersDataRouter = require('./routes/usersData');
var app = express();
var nodemailer = require('nodemailer');

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:4000'], credentials: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);
app.use('/companies', companiesRouter);
app.use('/companies/data', companiesDataRouter);
app.use('/companies/deals', companiesDealsRouter);
app.use('/users/data', usersDataRouter);
module.exports = app;
