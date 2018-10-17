module.exports = (function() {
  'use strict';
  const { Client } = require('pg');
  const User = require('../models/user.js');
  const Class = require('../models/class.js');

  var facultyRoute = require ('express').Router();

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
  })
  .catch(function () {
  });

//CLASSES
facultyRoute.get('/',
  function (req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Class.listByFacultyId(client, req.user.id, function (classes) {
      res.render('partials/faculty/class', {
        classes: classes,
        title: 'Faculty',
        layout: 'faculty'
      });
       });
        } else {
    res.redirect('/')
  }
  });


// CLASS DETAILS
facultyRoute.get('/class/:id',
  (req, res) => {
      if (req.isAuthenticated() && req.user.user_type == 'faculty') {
    Class.getById(client, req.params.id, function (classData) {
      Class.getStudentsByClassId(client, req.params.id, function (classStudents){
      res.render('partials/faculty/class_details', {
        layout: 'faculty',
        classData: classData,
        classStudents: classStudents 
      });
    });
      });
      } else {
    res.redirect('/')
  }
  });


return facultyRoute;
})();




//sir tria
/* GET home page. */
// router.get('/', function(req, res, next) {
//   if (req.isAuthenticated() && req.user.user_type == 'faculty') {
//     res.render('faculty/home', { layout: 'faculty' });
//   } else {
//     res.redirect('/')
//   }
// });

// router.get('/classes', function(req, res, next) {
//   if (req.isAuthenticated() && req.user.user_type == 'faculty') {
//     Class.listByFacultyId(req.user.id)
//       .then((classes) => {
//         console.log('classes', classes)
//         res.render('faculty/classes', { layout: 'faculty', classes: classes });
//       })
//   } else {
//     res.redirect('/')
//   }
// });


// router.get('/class/:classId', function(req, res, next) {
//   if (req.isAuthenticated() && req.user.user_type == 'faculty') {
//     Class.getById(req.params.classId)
//       .then((classData) => {
//         console.log('class', classData)
//         Class.getStudentsByClassId(req.params.classId).then((classStudents)=> {
//           res.render('faculty/class_detail', { layout: 'faculty', classData: classData, classStudents: classStudents });
//         })
//       })
//   } else {
//     res.redirect('/')
//   }
// });

