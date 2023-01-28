const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');


let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'elyasaf11@gmail.com',
    pass: 'yfkpuiockfqgykvr'
  }
});




router.post('/register', function (req, res) {
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

  const data = createSQLQuery.sqlSelect({
    distinct: false,
    columns: ['user_id'],
    tableName: "user_details",
    where: `user_name = '${req.body.username}' OR email = '${req.body.email}' OR phone = '${req.body.phone}'`,
    orderBy:[],
    join:[]
  })
    if (data) {
      console.log("Username or email or phone-number already exists");
      return;
    } else {
      createSQLQuery.insertIntoTable('user_details',['user_name','password','phone','email'],[req.body.username,req.body.password,req.body.phone,req.body.email]);
      res.send(true);
    }
});


router.post('/logIn', async function (req, res) {
  const data = createSQLQuery.sqlSelect({
    distinct: false,
    columns: ['user_name'],
    tableName: "user_details",
    where: `user_name = '${req.body.username}' and password = '${req.body.password}'`,
    orderBy:[],
    join:[]
  })
  console.log(data);
  // if(data){
  //   res.send(true);
  // }else{
  //   res.send(false);
  // }
});

router.post('/changePassword', function (req, res) {
 createSQLQuery.updateTable('user_details',['password'],[req.body.password],[`email='${req.body.email}'`]);
// if(data){
//   res.send(true);
// }else{
//   res.send(false);
// }
});


router.post('/password', function (req, res) {
  let sql = `select user_name from user_details where email = '${req.body.email}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    if (result.length > 0) {

      let mailOptions = {
        from: 'elyasaf11@gmail.com',
        to: `${req.body.email}`,
        subject: 'Sending Email using Node.js',
        text: 'click on the link to reset your password http://localhost:3000/changePassword'
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          res.send(true);
        }
      });
    } else {
      res.send(false);
    }
  });
});


module.exports = router;




