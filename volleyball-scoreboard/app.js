var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socketIO = require('socket.io');
var http = require('http');
var bcrypt = require('bcryptjs');
var db = require('./routes/db');
var session = require('express-session');
var { initializeAdminUser } = require('./models/users');

require('dotenv').config();

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var teamsRouter = require('./routes/teams');
var matchRouter = require('./routes/match');
const router = require('./routes/index');

var app = express();
var server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('a user connected');
});
global.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));
app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  res.locals.userRole = req.session.userRole || null;
  res.locals.login = req.session.login || null;
  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/teams', teamsRouter);
app.use('/match', matchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

initializeAdminUser();

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});