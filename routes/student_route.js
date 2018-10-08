module.exports = (function() {
  'use strict';

  var studentRoute = require ('express').Router();


// CLIENT PRODUCTS LIST IF LOGGED
studentRoute.get('/',
  // checkAuthentication,
  function (req, res, next) {
    // Product.list(client, {limit: 10}, {offset: (req.query.p - 1) * 10}, {
    // }, function (products) {
      res.render('partials/student/profile', {
        // products: products,
        title: 'Products',
        layout: 'student'
        // ,
        // pagination: {
        //   page: req.query.p || 1,
        //   limit: 10,
        //   n: req.query.p || 1
        // }
      });
    // });
  });

studentRoute.post('/updatestudent', function (req, res) {
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


// CLIENT PRODUCT DETAILS
studentRoute.get('/details/:id',
  // checkAuthentication,
  (req, res) => {
    Product.getByIdLogged(client, req.params.id, function (productData) {
      res.render('partials/student/details', productData);
    });
  });


// CLIENT BRANDS LIST IF LOGGED
studentRoute.get('/brands',
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



// CLIENT CATEGORIES LIST IF LOGGED
studentRoute.get('/categories',
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




return studentRoute;
})();