const express = require('express');
const path = require('path');

var exphbs = require('express-handlebars');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const nodemailer = require('nodemailer');
const { Client } = require('pg');

//instantiate client using your db config
const client = new Client({
  database: 'dbfv26t4cvpk7f',
  user: 'pldaynnnltnwja',
  password: 'ea36c3291d38ba07e73ae896a34e7d38e16d80b39463bc191f6ea95c23429737',
  host: 'ec2-23-23-242-163.compute-1.amazonaws.com',
  port: 5432
});

const app = express();

// tell express which folder is a static/public folder
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





// POST route from contact form
app.post('/contact', function (req, res) {
  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS
    }
  });
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: GMAIL_USER,
    subject: 'New message from contact form at tylerkrys.ca',
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
      res.render('contact-failure');
    }
    else {
      res.render('contact-success');
    }
  });
});






app.listen(process.env.PORT || 4000, function() {
  console.log('Server started at port 4000');
});