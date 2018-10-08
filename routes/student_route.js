module.exports = (function() {
  'use strict';

  var studentRoute = require ('express').Router();


// CLIENT PRODUCTS LIST IF LOGGED
studentRoute.get('/',
  // checkAuthentication,
  function (req, res, next) {
    // Product.list(client, {limit: 10}, {offset: (req.query.p - 1) * 10}, {
    // }, function (products) {
      res.render('partials/student/products', {
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