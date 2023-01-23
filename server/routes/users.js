var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "z10mz10m",
  database: "final_project"
});

/* GET users listing. */
router.post('/', function(req, res) {
 console.log(req.body);
 con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = `INSERT INTO user_details VALUES (1,'${req.body.username}', '${req.body.password}')`;
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
});

 
});

router.post('/logIn', function(req, res) {
  console.log(req.body);
  con.connect(function(err) {
   if (err) throw err;
   console.log("Connected!");
   var sql = `select user_name from user_details where user_name = '${req.body.username}' and password = '${req.body.password}'`;
   con.query(sql, function (err, result) {
     if (err) throw err;
    res.send(result);
   });
 });
 });



module.exports = router;




