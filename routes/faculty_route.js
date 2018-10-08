module.exports = (function() {
  'use strict';

  var facultyRoute = require ('express').Router();



// CLIENT PRODUCTS LIST IF LOGGED
facultyRoute.get('/',
  // checkAuthentication,
  function (req, res, next) {
    // Product.list(client, {limit: 10}, {offset: (req.query.p - 1) * 10}, {
    // }, function (products) {
      res.render('partials/faculty/products', {
        // products: products,
        title: 'Products',
        layout: 'faculty'
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
facultyRoute.get('/details/:id',
  // checkAuthentication,
  (req, res) => {
    Product.getByIdLogged(client, req.params.id, function (productData) {
      res.render('partials/faculty/details', productData);
    });
  });


// CLIENT BRANDS LIST IF LOGGED
facultyRoute.get('/brands',
  // checkAuthentication,
  function (req, res) {
    Brand.list(client, {}, function (brands) {
      res.render('partials/faculty/brands', {
        brands: brands,
        layout: 'faculty',
        title: 'Brands'
      });
    });
  });



// CLIENT CATEGORIES LIST IF LOGGED
facultyRoute.get('/categories',
  // checkAuthentication,
  function (req, res) {
    Category.list(client, {}, function (categories) {
      res.render('partials/faculty/categories', {
        categories: categories,
        layout: 'faculty',
        title: 'Categories'
      });
    });
  });



return facultyRoute;
})();