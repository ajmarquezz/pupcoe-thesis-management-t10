const express = require('express');
const path = require('path');
const { Client } = require('pg');
const app = express();
var types = require('pg').types;
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var Handlebars = require('handlebars');
var MomentHandler = require('handlebars.moment');
var hbs = require('nodemailer-express-handlebars');
var paginate = require('handlebars-paginate');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var session = require('express-session');
// const bcrypt = require('bcrypt');
var bcrypt = require('bcryptjs');
const saltRounds = 10;
var flash = require('connect-flash');
// var crypto = require('crypto');
// var async = require('async');

Handlebars.registerHelper('paginate', paginate);
MomentHandler.registerHelpers(Handlebars);
require('dotenv').config();

// callbacks
// const Product = require('./models/product.js');
// const Customer = require('./models/customer.js');
const Faculty = require('./models/faculty.js');
const Class = require('./models/class.js');
const Student = require('./models/student.js');
// const Email = require('./utils/email.js');

// instantiate client using your db config
const client = new Client({
  database: 'd2e89uf6dlr7q5',
  user: 'melgulxabeyzzp',
  password: 'e6d2c7d6c1922a4e41a4acb2a52352dcf75ff97d6c2a7333fdef28047bd6b235',
  host: 'ec2-184-73-197-211.compute-1.amazonaws.com',
  port: 5432,
  ssl: true
});

client.connect()
  .then(function () {
    console.log('Connected to Database!');
  })
  .catch(function () {
    console.log('Error Connecting to Database');
  });

// pang parse nung date na galing sa db, para tama yung display using moments
types.setTypeParser(1114, function (stringValue) {
  return new Date(Date.parse(stringValue + '+0000'));
});

// Configure the local strategy for use by Passport.
passport.use(new Strategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
function (email, password, cb) {
  Faculty.getByEmail(client, email, function (user) {
    if (!user) { return cb(null, false); }
    bcrypt.compare(password, user.password).then(function (res) {
      if (res === false) { return cb(null, false); }
      return cb(null, user);
    });
  });
}));

// Configure Passport authenticated session persistence.
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  Faculty.getById(client, id, function (user) {
    // if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(cookieParser());

//passport initialization
app.use(session({
  key: 'user_sid',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: 600000
  }
}));
app.use(flash());

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// tell express which folder is a static/public folder
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/html' }));
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

// // CHECK IF AUTHENTICATED
// function checkAuthentication (req, res, next) {
//   if (req.isAuthenticated()) {
//     // req.isAuthenticated() will return true if user is logged in
//     next();
//   } else {
//     res.redirect('/');
//   }
// };

// CHECK IF ADMIN
function checkAdmin (req, res, next) {
  if (req.isAuthenticated()) {
    Faculty.getFaculty(client, {facultyId: req.user.id}, function (user) {
      is_admin = user[0].is_admin;
      console.log('role:', is_admin);
      if (is_admin === 'true') {
        return next();
      } else {
        res.redirect('/faculty');
      }
    });
  } else {
    res.redirect('/');
  }
}

// // CHECK IF FACULTY
// function checkFaculty (req, res, next) {
//   if (req.isAuthenticated()) {
//     Customer.getCustomer(client, {customerId: req.user.id}, function (user) {
//       userrole = user[0].userrole;
//       console.log('role:', userrole);
//       if (userrole === 'faculty') {
//         return next();
//       } else {
//         res.redirect('/home');
//       }
//     });
//   } else {
//     res.redirect('/');
//   }
// }

// // CHECK IF STUDENT
// function checkStudent (req, res, next) {
//   if (req.isAuthenticated()) {
//     Customer.getCustomer(client, {customerId: req.user.id}, function (user) {
//       userrole = user[0].userrole;
//       console.log('role:', userrole);
//       if (userrole === 'Student') {
//         return next();
//       } else {
//         res.redirect('/home');
//       }
//     });
//   } else {
//     res.redirect('/');
//   }
// }

// // CHECK IF GUEST
// function checkGuest (req, res, next) {
//   if (req.isAuthenticated()) {
//     Customer.getCustomer(client, {customerId: req.user.id}, function (user) {
//       userrole = user[0].userrole;
//       console.log('role:', userrole);
//       if (userrole === 'Guest') {
//         return next();
//       } else {
//         res.redirect('/home');
//       }
//     });
//   } else {
//     res.redirect('/');
//   }
// }


// LOGIN
app.get('/', function (req, res) {
  res.render('partials/login/login', {
    title: 'Welcome'
  });
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/'
  })
);

// LOGOUT
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// RESET PASSWORD
app.get('/forgot', function (req, res) {
  res.render('partials/login/forgot', {
    title: 'Reset Password'
  });
});

// app.post('/forgot', function (req, res, next) {
//   async.waterfall([
//     function (done) {
//       crypto.randomBytes(20, function (err, buf) {
//         var token = buf.toString('hex');
//         done(err, token);
//       });
//     },
//     function (token, done) {
//       Customer.getByEmail1(client, { email: req.body.email }, {resetPasswordToken: token}, {resetPasswordExpires: Date.now() + 3600000}, function (user) {
//         if (!user) {
//           req.flash('error', 'No account with that email address exists.');
//           return res.redirect('/forgot');
//         }

//         user.resetPasswordToken = token;
//         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

//         //  user.save(function(err) {
//         //   done(err, token, user);
//         // });
//       });
//     },

//     function (token, user, done) {
//       var smtpTransport = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//           user: process.env.GMAIL_USER,
//           pass: process.env.GMAIL_PASS
//         }
//       });
//       var mailOptions = {
//         to: user.email,
//         from: process.env.GMAIL_USER,
//         subject: 'Password Reset',
//         text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//           'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//           'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//           'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//       };
//       smtpTransport.sendMail(mailOptions, function (err) {
//         console.log('mail sent');
//         req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
//         done(err, 'done');
//       });
//     }
//   ], function (err) {
//     if (err) return next(err);
//     res.redirect('/forgot');
//   });
// });

// app.get('/reset/:token', function (req, res) {
//   Customer.getByEmail1(client, email, { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
//     if (!user) {
//       req.flash('error', 'Password reset token is invalid or has expired.');
//       return res.redirect('/forgot');
//     }
//     res.render('partials/login/reset', {token: req.params.token});
//   });
// });

// app.post('/reset/:token', function (req, res) {
//   async.waterfall([
//     function (done) {
//       Customer.getByEmail1(client, email, { resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
//         if (!user) {
//           req.flash('error', 'Password reset token is invalid or has expired.');
//           return res.redirect('back');
//         }
//         if (req.body.password === req.body.confirm) {
//           user.setPassword(req.body.password, function (err) {
//             user.resetPasswordToken = undefined;
//             user.resetPasswordExpires = undefined;

//             // user.save(function(err) {
//             //   req.logIn(user, function(err) {
//             //     done(err, user);
//             //   });
//             // });
//           });
//         } else {
//           req.flash('error', 'Passwords do not match.');
//           return res.redirect('back');
//         }
//       });
//     },
//     function (user, done) {
//       var smtpTransport = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//           user: process.env.GMAIL_USER,
//           pass: process.env.GMAIL_PASS
//         }
//       });
//       var mailOptions = {
//         to: user.email,
//         from: process.env.GMAIL_USER,
//         subject: 'Your password has been changed',
//         text: 'Hello,\n\n' +
//           'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
//       };
//       smtpTransport.sendMail(mailOptions, function (err) {
//         req.flash('success', 'Success! Your password has been changed.');
//         done(err);
//       });
//     }
//   ], function (err) {
//     res.redirect('/');
//   });
// });

//ADMIN INSERT FACULTY
app.post('/insertfaculty', function (req, res) {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      console.log('error');
    } else {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        if (err) {
          console.log('error');
        } else {
          console.log('signup data', req.body, hash);
          Faculty.create(client, {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            password: hash,
            admin: req.body.admin
          }, function (faculty) {
            if (faculty === 'success') {
              console.log('INSERTED');
              res.redirect('/admin/faculties');
            } else if (faculty === 'error') {
              res.render('partials/admin/error', {
                msg: 'There was a problem adding a Faculty.',
                msg2: 'Try Again?',
                title: 'Error',
                action: 'adding',
                page: 'faculty',
                layout: 'admin',
                link: '/admin/faculty'
              });
            }
          });
        }
      });
    }
  });
});


//ADMIN INSERT STUDENT
app.post('/insertstudent', function (req, res) {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      console.log('error');
    } else {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        if (err) {
          console.log('error');
        } else {
          console.log('signup data', req.body, hash);
          Student.create(client, {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            student_number: req.body.student_number,
            email: req.body.email,
            phone: req.body.phone,
            password: hash
          }, function (student) {
            if (student === 'success') {
              console.log('INSERTED');
              res.redirect('/admin/students');
            } else if (student === 'error') {
              res.render('partials/admin/error', {
                msg: 'There was a problem adding a student.',
                msg2: 'Try Again?',
                title: 'Error',
                action: 'adding',
                page: 'student',
                layout: 'admin',
                link: '/admin/students'
              });
            }
          });
        }
      });
    }
  });
});

//ADMIN INSERT CLASS
app.post('/insertclass', function (req, res) {
  Class.create(client, {
    batch: req.body.batch,
    section: req.body.section,
    adviser: req.body.adviser
  }, function (classes) {
    if (classes === 'success') {
      console.log('INSERTED');
      res.redirect('/admin/class');
    } else if (classes === 'error') {
      res.render('partials/admin/error', {
        msg: 'There was a problem adding a class.',
        msg2: 'Try Again?',
        title: 'Error',
        action: 'adding',
        page: 'class',
        layout: 'admin',
        link: '/admin/class'
      });
    }
  });
});


//ROUTES
var adminRoute = require("./routes/admin_route");
app.use("/admin", adminRoute);

var facultyRoute = require("./routes/faculty_route");
app.use("/faculty", facultyRoute);

var guestRoute = require("./routes/guest_route");
app.use("/guest", guestRoute);

var nonLoggedRoute = require("./routes/non_logged_route");
app.use("/visitor", nonLoggedRoute);

var studentRoute = require("./routes/student_route");
app.use("/student", studentRoute);

// SERVER
app.listen(process.env.PORT || 4000, function () {
  console.log('Server started at port 4000');
});
