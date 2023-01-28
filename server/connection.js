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


  module.exports = con;
