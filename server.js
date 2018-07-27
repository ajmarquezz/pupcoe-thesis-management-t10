const express = require('express');
const path = require('path');
var exphbs = require('express-handlebars');

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
app.engine('handlebars', exphbs({defaultLayout: 'member'}));
app.set('view engine' , 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){

	res.render('member', {
		name: 'Homework No. 2',
		imageurl: '/img.jpg',
	})
});

app.get('/member/1', function(req, res){

	res.render('member', {
		name: 'Jose Alfonso Marquez',
		email: 'marquez.josealfonso@gmail.com',
		phone: '09550464578',
		imageurl: '/marquez.jpg',
		hobbies: ['Playing Volleyball &', 'Mobile Games']
	})
});

app.get('/member/2', function(req, res){

	res.render('member', {
		name: 'Patricia Navarro',
		email: 'patgnavarro@gmail.com',
		phone: '09173591423',
		imageurl: '/navarro.jpg',
		hobbies: ['Singing &', 'Playing Musical Instruments']
	})

});



app.listen(process.env.PORT || 4000, function() {
	console.log('Server started at port 4000');
});