var express = require('express');
var router = express.Router();

// Import custom "config" node module. It holds a single object with MySQL credentials.
var config = require('../config/config');

// Include the MySQL module (which was downloaded via npm)
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: config.host,
	user: config.userName,
	password: config.password,
	database: config.database
})

// Connect to SQL. Now you can write queries!

connection.connect();


/* GET home page. */
router.get('/', function(req, res, next) {
	var message = req.query.msg;
	if (message == "added"){
		message = "Your task was added!";
	}
	var selectQuery = "SELECT * FROM tasks";
	connection.query(selectQuery, (error, results)=>{
  		res.render('index', {
  			message: message,
  			taskArray: results
  		});
  	});
});


// Create a post route, "addItem", to handle form submission.

router.post('/addItem',(req,res)=>{
	var newTask = req.body.newTask;
	var dueDate = req.body.newTaskDate;

	// Now that form submission information is stored as variables, insert it into SQL.

	var insertQuery = "INSERT INTO tasks (taskName, taskDate) VALUES ('" + newTask + "','" + dueDate + "')";
	// res.send(insertQuery);
	connection.query(insertQuery, (error, results)=>{
		if(error) throw error;
		res.redirect('/?msg=added');
	});

});


router.get('/delete/:id',(req,res)=>{
	var idToDelete = req.params.id;
	var deleteQuery = "DELETE from tasks WHERE id = " + idToDelete;
	connection.query(deleteQuery,(error,results)=>{
		res.redirect('/?msg=deleted')
	});
	// res.send(idToDelete);

});


module.exports = router;
