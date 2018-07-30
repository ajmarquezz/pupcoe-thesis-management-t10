const express = require('express');
const path = require('path');
const { Client } = require('pg');

var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

require('dotenv').config();

//instantiate client using your db config
const client = new Client({
  database: 'd4eauqnb9enq45',
  user: 'yatlgqilgietmr',
  password: '44093842950dce7a5e0ae0e7b00f568e414fb62c13610586ada390616c57b353',
  host: 'ec2-23-21-216-174.compute-1.amazonaws.com',
  port: 5432
});

//display from database
//delete mo to pat
// client.query("SELECT * FROM sample", (err,res) => {

//   client.end();
// });


const app = express();

// tell express which folder is a static/public folder
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/html' }));
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine' , 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', function(req, res){

    return client.query('SELECT * FROM products;')
    .then((results) =>{
      console.log('results?', results);
      res.render('products'
        // , {
        // productName: 'Product 1 Sample',
        // imageUrl: '/img.jpg'
        //   }
      ,results);

      
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
  
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
app.post('/details/contact', function (req, res) {

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
    text: 'You have a submission with the following details: Name: '+req.body.name+'Email: '+req.body.email+'Phone Number: '+req.body.phone+'Product ID: '+req.body.product+'Quantity: '+req.body.quantity,
    html: '<p>You have a submission with the following details:</p><ul><li>Name: '+req.body.name+'</li><li>Email: '+req.body.email+'</li><li>Phone Number: '+req.body.phone+'</li><li>Product ID: '+req.body.product+'</li><li>Quantity: '+req.body.quantity+'</li></ul>'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      res.redirect('/details');
    } else {
      console.log('Message Sent: '+info.response);
      res.redirect('/');
    }
  });
});


app.listen(process.env.PORT || 4000, function() {
  console.log('Server started at port 4000');
});