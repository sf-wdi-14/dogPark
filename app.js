// ================
// START BOILERPLATE
var express 	 = require('express');
var app     	 = express();
var path    	 = require('path');
var pg      	 = require('pg');
var bodyParser = require('body-parser');
var db 				 = {};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

db.config = {
	// THIS NEEDS TO BE YOUR DB NAME:
  database: "dogpark",
  host: "localhost",
  port: "5432"
}

db.connect = function(callback) {
  pg.connect(this.config, callback);
}

db.query = function(statement, params, callback) {
  this.connect(function(err, client, done){
      client.query(statement, params, callback);
    done();
  })
}

// ================
// END BOILERPLATE



// ************************
// ************************
// ************************
// ************************
// ************************
// YOUR ROUTES:


// Demo using URL params and EJS logic
app.get("/bouncer/:name/:age", function(req,res) {
	res.render('bouncer', {person: req.params.name, age: req.params.age});
})
// Retrieves all dogs and displays them in an EJS loop
app.get("/dogs", function(req, res){
	db.query("SELECT * FROM dogs", function(err, dbResult){
    if (err) {
      console.log(err);
    }
    res.render('all_dogs', {dogs: dbResult.rows});
    console.log(dbResult.rows);
	 });
});

// Just renders the dog form
app.get('/dogForm', function(req, res){
	res.render("dogForm");
});

// Takes data from dog form and inserts into DB
app.post('/insertDog', function(req, res){
	var name = req.body.dog_name;
	var breed = req.body.dog_breed;
	var age = req.body.dog_age;

	db.query("INSERT INTO dogs (name, breed, age) VALUES ($1, $2, $3)", [name, breed, age], function(err, dbResult){
    if (err) {
      console.log(err);
      res.send("ERROR!")
    } else {
    	// console.log(dbResult);
    	res.redirect("/dogs");
	  }
	 });
});

// First step towards creating new dogs.  Uses URL params instead of Form
// app.get("/addDog/:name/:breed/:age", function(req, res) {
// 	var name = req.params.name;
// 	var breed = req.params.breed;
// 	var age = req.params.age;
// 	console.log("THIS IS WHERE WE WILL ADD LUCKY TO DB");
// 	db.query("INSERT INTO dogs (name, breed, age) VALUES ($1, $2, $3)", [name, breed, age], function(err, dbResult){
//     if (err) {
//       console.log(err);
//       res.send("ERROR!")
//     } else {
//     	// console.log(dbResult);
//     	res.send("Added " + name + " to the DB")
// 	  }
// 	 });
// })


app.listen(process.env.PORT || 3000);

