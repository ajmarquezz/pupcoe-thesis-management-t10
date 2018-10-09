module.exports = (function() {
  'use strict';

const { Client } = require('pg');
// const bcrypt = require('bcrypt');
var bcrypt = require('bcryptjs');
const saltRounds = 10;
const Faculty = require('../models/faculty.js');
const Class = require('../models/class.js');
const Student = require('../models/student.js');

var adminRoute = require ('express').Router();

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


// ADMIN PROFILE
adminRoute.get('/',
  // checkAdmin,
  function (req, res) {
  // Customer.getCustomer(client, {customerId: req.user.id}, function (user) {
    res.render('partials/admin/profile-admin', {
      // user: user,
      layout: 'admin',
      title: 'Welcome'
    });
  // });
});

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
    Faculty.list(client, {}, function (faculty) {
      res.render('partials/admin/faculties-admin', {
        faculty: faculty,
        layout: 'admin',
        title: 'Faculty'
      });
    });
  });

// ADMIN ADD FACULTIES
adminRoute.get('/faculties/add_faculty',
  // checkAdmin,
  function (req, res) {
      res.render('partials/admin/faculties-add-admin', {
        layout: 'admin',
        title: 'Add Faculty'
      });
  });

adminRoute.post('/insertfaculty', function (req, res) {
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

// // ADMIN EDIT FACULTIES
// adminRoute.get('/faculty/update/:id',
//   // checkAdmin,
//   function (req, res) {
//     // Category.getById(client, req.params.id, function (categoryData) {
//       res.render('partials/admin/faculties-update-admin', {
//         // category: categoryData,
//         title: 'Category',
//         layout: 'admin'
//       });
//     // });
//   });

// adminRoute.post('/edit-faculty/:id',
//   // checkAdmin,
//   function (req, res) {
//     Category.update(client, {categoryId: req.params.id}, {
//       category_name: req.body.name
//     }, function (category) {
//       if (category === 'success') {
//         res.redirect('/admin/categories');
//       } else if (category === 'error') {
//         res.render('partials/admin/error', {
//           msg: 'There was a problem updating the Category.',
//           msg2: 'Try Again?',
//           title: 'Error',
//           page: 'category',
//           action: 'updating',
//           layout: 'admin',
//           link: '/admin/categories'
//         });
//       }
//     });
//   });



// ADMIN STUDENTS LIST
adminRoute.get('/students',
  // checkAdmin,
  function (req, res) {
    Student.list(client, {}, function (student) {
      res.render('partials/admin/students-admin', {
        student: student,
        layout: 'admin',
        title: 'Students'
      });
    });
  });

// ADMIN ADD STUDENTS
adminRoute.get('/students/add_student',
  // checkAdmin,
  function (req, res) {
      res.render('partials/admin/students-add-admin', {
        layout: 'admin',
        title: 'Add Student'
      });
  });

adminRoute.post('/insertstudent', function (req, res) {
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

// // ADMIN EDIT STUDENTS
// adminRoute.get('/student/update/:id',
//   // checkAdmin,
//   function (req, res) {
//     // Brand.getById(client, req.params.id, function (brandData) {
//       res.render('partials/admin/students-update-admin', {
//         // brands: brandData,
//         title: 'Brand',
//         layout: 'admin'
//       });
//     // });
//   });

// adminRoute.post('/edit-student/:id', function (req, res) {
//   Brand.update(client, {brandId: req.params.id}, {
//     brand_name: req.body.name,
//     brand_desc: req.body.description
//   }, function (brand) {
//     if (brand === 'success') {
//       res.redirect('/admin/students');
//     } else if (brand === 'error') {
//       res.render('partials/admin/error', {
//         msg: 'There was a problem Updating the Brand.',
//         msg2: 'Try Again?',
//         title: 'Error',
//         action: 'updating',
//         page: 'category',
//         layout: 'admin',
//         link: '/admin/brands'
//       });
//     }
//   });
// });



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

// ADMIN ADD CLASS
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

// // ADMIN CLASS UPDATE
// adminRoute.get('/class/update/:id',
//   // checkAdmin,
//   function (req, res) {
//     Category.list(client, {}, function (categories) {
//       Brand.list(client, {}, function (brands) {
//         Product.getById(client, req.params.id, function (productData) {
//           res.render('partials/admin/class-update-admin', {
//             products: productData,
//             layout: 'admin',
//             brands: brands,
//             title: 'Products',
//             categories: categories
//           });
//         });
//       });
//     });
//   });

// adminRoute.post('/edit-products/:id', function (req, res) {
//   client.query("UPDATE products SET name = '" + req.body.name + "', description = '" + req.body.description + "', price = '" + req.body.price + "', tagline = '" + req.body.tagline + "', warranty = '" + req.body.warranty + "',category_id = '" + req.body.category + "', brand_id = '" + req.body.brand + "', pic = '" + req.body.image + "'WHERE id = '" + req.params.id + "' ;");
//   res.redirect('/admin/products');
// });


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

// ADMIN ADD GUEST
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

// // ADMIN EDIT GUEST
// adminRoute.get('/guest/update/:id',
//   // checkAdmin,
//   function (req, res) {
//     // Category.getById(client, req.params.id, function (categoryData) {
//       res.render('partials/admin/guests-update-admin', {
//         // category: categoryData,
//         title: 'Category',
//         layout: 'admin'
//       });
//     // });
//   });

// adminRoute.post('/edit-guest/:id',
//   // checkAdmin,
//   function (req, res) {
//     Category.update(client, {categoryId: req.params.id}, {
//       category_name: req.body.name
//     }, function (category) {
//       if (category === 'success') {
//         res.redirect('/admin/guests');
//       } else if (category === 'error') {
//         res.render('partials/admin/error', {
//           msg: 'There was a problem updating the Category.',
//           msg2: 'Try Again?',
//           title: 'Error',
//           page: 'category',
//           action: 'updating',
//           layout: 'admin',
//           link: '/admin/guests'
//         });
//       }
//     });
//   });

return adminRoute;
})();