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
// var crypto = require('crypto');
// var async = require('async');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// var userrole;
var flash = require('connect-flash');

Handlebars.registerHelper('paginate', paginate);
MomentHandler.registerHelpers(Handlebars);
require('dotenv').config();

// callbacks
const Product = require('./models/product.js');
const Customer = require('./models/customer.js');
const Order = require('./models/order.js');
const Brand = require('./models/brand.js');
const Category = require('./models/category.js');
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
  Customer.getByEmail(client, email, function (user) {
    // if (err) { return cb(err); }
    if (!user) { return cb(null, false); }
    bcrypt.compare(password, user.password).then(function (res) {
    // if (user.password !== password) { return cb(null, false); }
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
  Customer.getById(client, id, function (user) {
    // if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(cookieParser());
// passport initialization
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
// Initialize Passport and restore authentication state, if any, from the
// session.
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

// function checkAdmin (req, res, next) {
//   if (req.isAuthenticated()) {
//     Customer.getCustomer(client, {customerId: req.user.id}, function (user) {
//       userrole = user[0].userrole;
//       console.log('role:', userrole);
//       if (userrole === 'admin') {
//         return next();
//       } else {
//         res.redirect('/home');
//       }
//     });
//   } else {
//     res.redirect('/');
//   }
// }

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

//////////////////////////////////////////==============START OF ROUTES===============\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// LOGIN OR REGISTTRATION PAGE
app.get('/', function (req, res) {
  res.render('partials/login/login', {
    title: 'Welcome'
  });
});

// LOGIN
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/'
  })
);

// UPDATE PROFILE
app.get('/profile',
  // checkAuthentication,
  function (req, res) {
    Customer.getCustomer(client, {customerId: req.user.id}, function (user) {
      res.render('partials/student/profile', {
        user: user,
        layout: 'student'
      });
    });
  });

app.post('/updateprofile', function (req, res) {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      console.log('error');
    } else {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        if (err) {
          console.log('error');
        } else {
          Customer.updateProfile(client, {customerId: req.user.id}, {
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            street: req.body.street,
            municipality: req.body.municipality,
            province: req.body.province,
            zipcode: req.body.zipcode,
            password: hash,
            // userrole: 'user'
          }, function (user) {
            res.redirect('/home');
          });
        };
      });
    };
  });
});

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

// CLIENT PRODUCTS LIST IF NOT LOGGED
app.get('/products', function (req, res, next) {
  Product.list(client, {limit: 10}, {offset: (req.query.p - 1) * 10}, {
  }, function (products) {
    res.render('partials/student/products', {
      products: products,
      title: 'Products'
      // ,
      // pagination: {
      //   page: req.query.p || 1,
      //   limit: 10,
      //   n: req.query.p || 1
      // }
    });
  });
});

// CLIENT PRODUCTS LIST IF LOGGED
app.get('/shop/products',
  // checkAuthentication,
  function (req, res, next) {
    Product.list(client, {limit: 10}, {offset: (req.query.p - 1) * 10}, {
    }, function (products) {
      res.render('partials/student/products', {
        products: products,
        title: 'Products',
        layout: 'student'
        // ,
        // pagination: {
        //   page: req.query.p || 1,
        //   limit: 10,
        //   n: req.query.p || 1
        // }
      });
    });
  });

// CLIENT PRODUCT DETAILS
app.get('/details/:id',
  // checkAuthentication,
  (req, res) => {
    Product.getByIdLogged(client, req.params.id, function (productData) {
      res.render('partials/student/details', productData);
    });
  });

app.post('/details/:id/contact', function (req, res) {
  let mailOptions1 = {
    viewEngine: {
      extname: '.handlebars',
      layoutsDir: 'views/layouts/',
      defaultLayout: 'template',
      partialsDir: 'views/partials/'
    },
    viewPath: 'views/partials/email/',
    extName: '.handlebars',
    from: '"A&P Clothing" <dbms.projects1819@gmail.com>',
    to: req.body.email,
    subject: 'Order Received',
    template: 'email.body',
    context: {
      status: 'Your order was sent to us',
      message: 'Thank you for shopping with us. For inquiries, contact us at dbms.projects1819@gmail.com',
      name: req.body.firstname + ' ' + req.body.lastname,
      email: req.body.email,
      number: req.body.phone,
      productid: req.body.product,
      quantity: req.body.quantity,
      address: req.body.street + ' ' + req.body.municipality + ', ' + req.body.province + ' ' + req.body.zipcode
    }
  };

  let mailOptions2 = {
    viewEngine: {
      extname: '.handlebars',
      layoutsDir: 'views/layouts/',
      defaultLayout: 'template',
      partialsDir: 'views/partials/'
    },
    viewPath: 'views/partials/email/',
    extName: '.handlebars',
    from: '"A&P Clothing" <dbms.projects1819@gmail.com>',
    to: 'patgnavarro@gmail.com, marquez.josealfonso@gmail.com',
    subject: 'New Order Request',
    template: 'email.body',
    context: {
      status: 'New order request',
      message: '',
      name: req.body.firstname + ' ' + req.body.lastname,
      email: req.body.email,
      number: req.body.phone,
      productid: req.body.product,
      quantity: req.body.quantity,
      address: req.body.street + ' ' + req.body.municipality + ', ' + req.body.province + ' ' + req.body.zipcode
    }
  };

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  transporter.use('compile', hbs(mailOptions1));
  transporter.sendMail(mailOptions1, (error, info) => {
    if (error) {
      res.render('partials/student/mailstatus', {
        msg: 'There was a problem creating your order.',
        msg2: 'Continue Shopping and Try Again?',
        title: 'Error'
      });
      console.log('error', error);
    } else {
      client.query("INSERT INTO customers (email, first_name, last_name, street, municipality, province, zipcode) VALUES ('" + req.body.email + "', '" + req.body.firstname + "', '" + req.body.lastname + "', '" + req.body.street + "', '" + req.body.municipality + "','" + req.body.province + "','" + req.body.zipcode + "' ) ON CONFLICT (email) DO UPDATE SET first_name = ('" + req.body.firstname + "'), last_name = ('" + req.body.lastname + "'),street = ('" + req.body.street + "'),municipality = ('" + req.body.municipality + "'),province = ('" + req.body.province + "'), zipcode = ('" + req.body.zipcode + "')");
      client.query("SELECT id from customers WHERE email = '" + req.body.email + "';")
        .then((results) => {
          var id = results.rows[0].id;
          client.query("INSERT INTO orders (customer_id, product_id, quantity, order_date) VALUES ('" + id + "', '" + req.body.product + "','" + req.body.quantity + "', current_timestamp)");
        })
        .catch((err) => {
          console.log('error', err);
          res.send('Error!');
        });
      res.render('partials/student/mailstatus', {
        msg: 'Your order has been made!',
        msg2: 'Continue Shopping?',
        title: 'Success'
      });
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
  transporter.use('compile', hbs(mailOptions2));
  transporter.sendMail(mailOptions2, (error, info) => {
    if (error) {
      return console.log(error);
    } else {
      client.query("INSERT INTO customers (email, first_name, last_name, street, municipality, province, zipcode) VALUES ('" + req.body.email + "', '" + req.body.firstname + "', '" + req.body.lastname + "', '" + req.body.street + "', '" + req.body.municipality + "','" + req.body.province + "','" + req.body.zipcode + "' ) ON CONFLICT (email) DO UPDATE SET first_name = ('" + req.body.firstname + "'), last_name = ('" + req.body.lastname + "'),street = ('" + req.body.street + "'),municipality = ('" + req.body.municipality + "'),province = ('" + req.body.province + "'), zipcode = ('" + req.body.zipcode + "')");
      client.query("SELECT id from customers WHERE email = '" + req.body.email + "';")
        .then((results) => {
          var id = results.rows[0].id;
          client.query("INSERT INTO orders (customer_id, product_id, quantity, order_date) VALUES ('" + id + "', '" + req.body.product + "','" + req.body.quantity + "', current_timestamp)");
        })
        .catch((err) => {
          console.log('error', err);
          res.send('Error!');
        });
      res.render('partials/student/mailstatus', {
        msg: 'Your order has been made!',
        msg2: 'Continue Shopping?',
        title: 'Success'
      });
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
});

// CLIENT BRANDS LIST IF LOGGED
app.get('/shop/brands',
  // checkAuthentication,
  function (req, res) {
    Brand.list(client, {}, function (brands) {
      res.render('partials/student/brands', {
        brands: brands,
        layout: 'student',
        title: 'Brands'
      });
    });
  });

// CLIENT BRANDS LIST IF NOT LOGGED
app.get('/brands', function (req, res) {
  Brand.list(client, {}, function (brands) {
    res.render('partials/student/brands', {
      brands: brands,
      title: 'Brands'
    });
  });
});

// CLIENT CATEGORIES LIST IF LOGGED
app.get('/shop/categories',
  // checkAuthentication,
  function (req, res) {
    Category.list(client, {}, function (categories) {
      res.render('partials/student/categories', {
        categories: categories,
        layout: 'student',
        title: 'Categories'
      });
    });
  });

// CLIENT CATEGORIES LIST IF NOT LOGGED
app.get('/categories', function (req, res) {
  Category.list(client, {}, function (categories) {
    res.render('partials/student/categories', {
      categories: categories,
      title: 'Categories'
    });
  });
});

/// ////////////////////////////////////////=============ADMIN============\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// ADMIN HOMEPAGE PROFILE
app.get('/admin',
  // checkAdmin,
  function (req, res) {
  // Customer.highestPay(client, {}, function (customers) {
  //   Customer.mostOrders(client, {}, function (customer) {
  //     Product.mostOrdered(client, {}, function (products) {
  //       Product.leastOrdered(client, {}, function (product) {
  //         Brand.mostOrdered(client, {}, function (brands) {
  //           Category.mostOrdered(client, {}, function (categories) {
  //             Order.totalSales7(client, {}, function (order) {
  //               Order.totalSales30(client, {}, function (orders) {
  //                 Order.orderCount(client, {}, function (data) {
    res.render('partials/admin/profile-admin', {
      layout: 'admin',
      title: 'Welcome'
      // ,
      // top10pay: customers,
      // top10order: customer,
      // top10mostprod: products,
      // top10leastprod: product,
      // top3mostbrand: brands,
      // top3mostcateg: categories,
      // totalSales7: order,
      // totalSales30: orders,
      // orderCount: data
    });
  //                 });
  //               });
  //             });
  //           });
  //         });
  //       });
  //     });
  //   });
  // });
  });

// ADMIN UPDATE PROFILE
app.post('/updateadminprofile', function (req, res) {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      console.log('error');
    } else {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        if (err) {
          console.log('error');
        } else {
          Customer.updateProfile(client, {customerId: req.user.id}, {
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            street: req.body.street,
            municipality: req.body.municipality,
            province: req.body.province,
            zipcode: req.body.zipcode,
            password: hash,
            // userrole: 'user'
          }, function (user) {
            res.redirect('/home');
          });
        };
      });
    };
  });
});

// ADMIN CLASS LIST
app.get('/admin/class',
  // checkAdmin,
  function (req, res, next) {
  // Category.list(client, {}, function (categories) {
  //   Brand.list(client, {}, function (brands) {
  //     Product.list(client, {limit: 10}, {offset: (req.query.p - 1) * 10}, {
  //     }, function (products) {
    res.render('partials/admin/class-admin', {
      layout: 'admin',
      title: 'Products'
      // ,
      // products: products,
      // brands: brands,
      // categories: categories,
      // pagination: {
      //   page: req.query.p || 1,
      //   limit: 10,
      //   n: req.query.p || 1
      // }
    });
  //     });
  //   });
  // });
  });

// ADMIN CREATE CLASS
app.post('/insertclass', function (req, res) {
  Product.create(client, {
    product_name: req.body.name,
    product_desc: req.body.description,
    product_tagline: req.body.tagline,
    product_price: req.body.price,
    product_warranty: req.body.warrranty,
    product_category: req.body.category,
    product_brand: req.body.brand,
    product_image: req.body.image
  }, function (products) {
    if (products === 'success') {
      res.redirect('/admin/class');
      console.log('insert success');
    } else if (products === 'error') {
      console.log('error');
      res.render('partials/admin/error', {
        msg: 'There was a problem creating the product.',
        msg2: 'Try Again?',
        title: 'Error',
        action: 'creating',
        page: 'product',
        layout: 'admin',
        link: '/admin/products'
      });
    }
  });
});

// ADMIN CLASS UPDATE
app.get('/admin/class/update/:id',
  // checkAdmin,
  function (req, res) {
    Category.list(client, {}, function (categories) {
      Brand.list(client, {}, function (brands) {
        Product.getById(client, req.params.id, function (productData) {
          res.render('partials/admin/class-update-admin', {
            products: productData,
            layout: 'admin',
            brands: brands,
            title: 'Products',
            categories: categories
          });
        });
      });
    });
  });

app.post('/edit-products/:id', function (req, res) {
  client.query("UPDATE products SET name = '" + req.body.name + "', description = '" + req.body.description + "', price = '" + req.body.price + "', tagline = '" + req.body.tagline + "', warranty = '" + req.body.warranty + "',category_id = '" + req.body.category + "', brand_id = '" + req.body.brand + "', pic = '" + req.body.image + "'WHERE id = '" + req.params.id + "' ;");
  res.redirect('/admin/products');
});

// ADMIN STUDENTS LIST
app.get('/admin/students',
  // checkAdmin,
  function (req, res) {
    // Brand.list(client, {}, function (brands) {
      res.render('partials/admin/students-admin', {
        // brands: brands,
        layout: 'admin',
        title: 'Brands'
      });
    // });
  });

// ADMIN CREATE STUDENTS
app.post('/insertstudent', function (req, res) {
  Brand.create(client, {
    brand_name: req.body.name,
    brand_desc: req.body.description
  }, function (brands) {
    if (brands === 'SUCCESS') {
      console.log('INSERTED');
      res.redirect('/admin/brands');
    } else if (brands === 'ERROR') {
      console.log('ERROR');
      res.render('partials/admin/error', {
        msg: 'There was a problem creating the brand.',
        msg2: 'Try Again?',
        title: 'Error',
        action: 'creating',
        page: 'brand',
        layout: 'admin',
        link: '/admin/brands'
      });
    }
  });
});

// ADMIN EDIT STUDENTS
app.get('/admin/student/update/:id',
  // checkAdmin,
  function (req, res) {
    // Brand.getById(client, req.params.id, function (brandData) {
      res.render('partials/admin/students-update-admin', {
        // brands: brandData,
        title: 'Brand',
        layout: 'admin'
      });
    // });
  });

app.post('/edit-student/:id', function (req, res) {
  Brand.update(client, {brandId: req.params.id}, {
    brand_name: req.body.name,
    brand_desc: req.body.description
  }, function (brand) {
    if (brand === 'success') {
      res.redirect('/admin/students');
    } else if (brand === 'error') {
      res.render('partials/admin/error', {
        msg: 'There was a problem Updating the Brand.',
        msg2: 'Try Again?',
        title: 'Error',
        action: 'updating',
        page: 'category',
        layout: 'admin',
        link: '/admin/brands'
      });
    }
  });
});

// ADMIN FACULTIES LIST
app.get('/admin/faculties',
  // checkAdmin,
  function (req, res) {
    // Category.list(client, {}, function (categories) {
      res.render('partials/admin/faculties-admin', {
        // categories: categories,
        layout: 'admin',
        title: 'Categories'
      });
    // });
  });

// ADMIN CREATE FACULTIES
app.post('/insertfaculty', function (req, res) {
  Category.create(client, {
    category_name: req.body.name
  }, function (category) {
    if (category === 'SUCCESS') {
      console.log('INSERTED');
      res.redirect('/admin/faculties');
    } else if (category === 'ERROR') {
      res.render('partials/admin/error', {
        msg: 'There was a problem creating the Category.',
        msg2: 'Try Again?',
        title: 'Error',
        action: 'creating',
        page: 'category',
        layout: 'admin',
        link: '/admin/categories'
      });
    }
  });
});

// ADMIN EDIT FACULTIES
app.get('/admin/faculty/update/:id',
  // checkAdmin,
  function (req, res) {
    // Category.getById(client, req.params.id, function (categoryData) {
      res.render('partials/admin/faculties-update-admin', {
        // category: categoryData,
        title: 'Category',
        layout: 'admin'
      });
    // });
  });

app.post('/edit-faculty/:id',
  // checkAdmin,
  function (req, res) {
    Category.update(client, {categoryId: req.params.id}, {
      category_name: req.body.name
    }, function (category) {
      if (category === 'success') {
        res.redirect('/admin/categories');
      } else if (category === 'error') {
        res.render('partials/admin/error', {
          msg: 'There was a problem updating the Category.',
          msg2: 'Try Again?',
          title: 'Error',
          page: 'category',
          action: 'updating',
          layout: 'admin',
          link: '/admin/categories'
        });
      }
    });
  });

// ADMIN GUEST LIST
app.get('/admin/guests',
  // checkAdmin,
  function (req, res) {
    // Category.list(client, {}, function (categories) {
      res.render('partials/admin/guests-admin', {
        // categories: categories,
        layout: 'admin',
        title: 'Categories'
      });
    // });
  });

// ADMIN CREATE GUEST
app.post('/insertguest', function (req, res) {
  Category.create(client, {
    category_name: req.body.name
  }, function (category) {
    if (category === 'SUCCESS') {
      console.log('INSERTED');
      res.redirect('/admin/guests');
    } else if (category === 'ERROR') {
      res.render('partials/admin/error', {
        msg: 'There was a problem creating the Category.',
        msg2: 'Try Again?',
        title: 'Error',
        action: 'creating',
        page: 'category',
        layout: 'admin',
        link: '/admin/categories'
      });
    }
  });
});

// ADMIN EDIT GUEST
app.get('/admin/guest/update/:id',
  // checkAdmin,
  function (req, res) {
    // Category.getById(client, req.params.id, function (categoryData) {
      res.render('partials/admin/guests-update-admin', {
        // category: categoryData,
        title: 'Category',
        layout: 'admin'
      });
    // });
  });

app.post('/edit-guest/:id',
  // checkAdmin,
  function (req, res) {
    Category.update(client, {categoryId: req.params.id}, {
      category_name: req.body.name
    }, function (category) {
      if (category === 'success') {
        res.redirect('/admin/guests');
      } else if (category === 'error') {
        res.render('partials/admin/error', {
          msg: 'There was a problem updating the Category.',
          msg2: 'Try Again?',
          title: 'Error',
          page: 'category',
          action: 'updating',
          layout: 'admin',
          link: '/admin/guests'
        });
      }
    });
  });

// SERVER
app.listen(process.env.PORT || 4000, function () {
  console.log('Server started at port 4000');
});
