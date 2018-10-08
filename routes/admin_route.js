module.exports = (function() {
  'use strict';

  var adminRoute = require ('express').Router();




// ADMIN PROFILE
adminRoute.get('/',
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
adminRoute.post('/updateadminprofile', function (req, res) {
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


// ADMIN FACULTIES LIST
adminRoute.get('/faculties',
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

adminRoute.get('/faculties/add_faculty',
  // checkAdmin,
  function (req, res) {
    // Category.list(client, {}, function (categories) {
      res.render('partials/admin/faculties-add-admin', {
        // categories: categories,
        layout: 'admin',
        title: 'Categories'
      });
    // });
  });


adminRoute.post('/insertfaculty', function (req, res) {
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
adminRoute.get('/faculty/update/:id',
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

adminRoute.post('/edit-faculty/:id',
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



// ADMIN STUDENTS LIST
adminRoute.get('/students',
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
adminRoute.get('/students/add_student',
  // checkAdmin,
  function (req, res) {
    // Category.list(client, {}, function (categories) {
      res.render('partials/admin/students-add-admin', {
        // categories: categories,
        layout: 'admin',
        title: 'Categories'
      });
    // });
  });

adminRoute.post('/insertstudent', function (req, res) {
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
adminRoute.get('/student/update/:id',
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

adminRoute.post('/edit-student/:id', function (req, res) {
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



// ADMIN CLASS LIST
adminRoute.get('/class',
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
adminRoute.get('/class/add_class',
  // checkAdmin,
  function (req, res) {
    // Category.list(client, {}, function (categories) {
      res.render('partials/admin/class-add-admin', {
        // categories: categories,
        layout: 'admin',
        title: 'Categories'
      });
    // });
  });

adminRoute.post('/insertclass', function (req, res) {
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
adminRoute.get('/class/update/:id',
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

adminRoute.post('/edit-products/:id', function (req, res) {
  client.query("UPDATE products SET name = '" + req.body.name + "', description = '" + req.body.description + "', price = '" + req.body.price + "', tagline = '" + req.body.tagline + "', warranty = '" + req.body.warranty + "',category_id = '" + req.body.category + "', brand_id = '" + req.body.brand + "', pic = '" + req.body.image + "'WHERE id = '" + req.params.id + "' ;");
  res.redirect('/admin/products');
});


// ADMIN GUEST LIST
adminRoute.get('/guests',
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
adminRoute.post('/insertguest', function (req, res) {
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
adminRoute.get('/guest/update/:id',
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

adminRoute.post('/edit-guest/:id',
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

return adminRoute;
})();