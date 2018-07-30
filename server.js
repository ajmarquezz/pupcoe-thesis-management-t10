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
  port: 5432,
  ssl: true
});

//INSERT INTO products(product_name, product_type, product_desc, brand, price, img_url) VALUES('Evian', 'Dress', 'Blue', 'Plains and Prints', 'PHP 1298', '/evian.jpg');

client.connect()
	.then(function() {
		console.log('connected to database!');
	})
	.catch(function() {
		console.log('Error');
	})


const app = express();

// tell express which folder is a static/public folder
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/html' }));
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine' , 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req,res) {
	client.query('SELECT * FROM products', (req, data)=>{
		var list = [];
		for (var i = 0; i < data.rows.length; i++) {
			list.push(data.rows[i]);
		}
		res.render('products',{
			data: list,
			title: 'Top Products'
		});
	});
});

app.get('/details/:id', (req,res)=>{
  var id = req.params.id;
  client.query('SELECT * FROM Products WHERE id = {{this.id}}', (req, data)=>{
    var list = [];
    for (var i = 0; i < data.rows.length+1; i++) {
      if (i==id) {
        list.push(data.rows[i-1]);
      }
    }
    res.render('details',{
      data: list  
    });
  });
});

app.post('/details/:id/contact', function (req, res) {

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