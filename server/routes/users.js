const express = require('express');
const router = express.Router();
const mysql = require('mysql');


const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "z10mz10m",
  database: "final_project"
});

con.connect(function (err) {
  if (err) throw err;
});


router.post('/', function (req, res) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
  const usernameRegex = /^[a-zA-Z0-9._-]{3,15}$/;
  const phoneRegex = /^(?:\+\d{1,3}|0\d{1,3}|\d{1,4})[\s.-]?\d{3}[\s.-]?\d{4}$/;

  if (!usernameRegex.test(req.body.username)) {
    console.log("Please enter a valid username");
    return;
  } else if (!passwordRegex.test(req.body.password)) {
    console.log("Please enter a valid password");
    return;
  } else if (!emailRegex.test(req.body.email)) {
    console.log("Please enter a valid email address");
    return;
  } else if (!phoneRegex.test(req.body.phone)) {
    console.log("Please enter a valid phone number");
    return;
  }
  //   let sql = `INSERT INTO user_details VALUES (1,'${req.body.username}', '${req.body.password}')`;
  //   con.query(sql, function (err, result) {
  //     if (err) throw err;
  //   });
  res.send(true);
});




router.post('/logIn', function (req, res) {
  let sql = `select user_name from user_details where user_name = '${req.body.username}' and password = '${req.body.password}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});




module.exports = router;




