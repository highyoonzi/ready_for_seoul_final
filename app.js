const express = require('express')
const app = express()
const port = 3000
/* test: abcdefghijikkk * Github/
/* Session */
const session = require('express-session');
app.use(session({
  secret: '@#@$MYSIGN#@$#$',
  resave: false,
  saveUninitialized: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

/* Database */
var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'readyforseoul',
  port: 8889  /* 8889 on Mac client */
});

/* Upload */
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
var upload = multer({ storage: _storage })
app.use('/uploads', express.static('uploads'));

/* URL */
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

/* Template */
app.set('view engine','ejs');
app.set('views','./views');
// app.locals.moment = require('moment');

/* static */
app.use('/static', express.static('static'));

/* root app */
var root = require('./routes/root.js')(app, conn);
app.use('/', root);

/* shop app */
var shop = require('./routes/shop.js')(app, conn);
app.use('/shop', shop);

/* qna app */
var qna = require('./routes/qna.js')(app, conn);
app.use('/qna', qna);

//  account app
var account = require('./routes/account.js')(app, conn);
app.use('/account', account);

/* Port listening */
app.listen(port, () => console.log(
    `Server is running... http://localhost:${port}`
))
