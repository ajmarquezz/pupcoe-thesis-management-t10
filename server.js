const express = require('express');
const path = require('path');
var exphbs = require('express-handlebars');
// const nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
require('dotenv').config();
const { Client } = require('pg');

//instantiate client using your db config
const client = new Client({
  database: 'dbfv26t4cvpk7f',
  user: 'pldaynnnltnwja',
  password: 'ea36c3291d38ba07e73ae896a34e7d38e16d80b39463bc191f6ea95c23429737',
  host: 'ec2-23-23-242-163.compute-1.amazonaws.com',
  port: 5432
});

//display from database
//delete mo to pat
// client.query("SELECT * FROM sample", (err,res) => {

//   client.end();
// });


const app = express();

// tell express which folder is a static/public folder
app.use(bodyParser.text({ type: 'text/html' }));
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine' , 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', function(req, res){

  res.render('products', {
    productName: 'Product 1',
    imageUrl: '/img.jpg'
  })
});

app.get('/details', function(req, res){

  res.render('details', {
    productName: 'Product 1',
    imageUrl: '/img.jpg',
    description: 'Description',
    productId: 'Product ID',
    productType: 'Product Type',
    brand: 'Brand',
    price: 'Price'

  })

});




//POST route from contact form
app.post('/contact', function (req, res) {

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  var mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: 'New Message from Shop Client',
    text: 'You have a submission with the following details: Name: '+req.body.name+'Email: '+req.body.email+'Message: '+req.body.message,
    html: '<p>You have a submission with the following details:</p><ul><li>Name: '+req.body.name+'</li><li>Email: '+req.body.email+'</li><li>Message: '+req.body.message+'</li></ul>'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      res.redirect('/details');
    } else {
      console.log('Message Sent: '+info.response);
      res.redirect('/details');
    }
  });
});



app.listen(process.env.PORT || 4000, function() {
  console.log('Server started at port 4000');
});