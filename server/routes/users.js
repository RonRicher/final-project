const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookie = require('cookie');




let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tripifycompany@gmail.com',
    pass: 'xjxpvpixjtbnzois'
  }
});

router.post('/register', async function (req, res) {

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
  const userId = uuidv4();

  bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {

    const data = await createSQLQuery.sqlSelect({
      distinct: false,
      columns: ['user_id'],
      tableName: "user_details",
      where: `user_name = '${req.body.username}' OR email = '${req.body.email}' OR phone = '${req.body.phone}'`,
      orderBy: [],
      join: []
    });
    if (data.length > 0) {
      console.log("Username or email or phone-number already exists");
      return;
    } else {
      const access = await createSQLQuery.insertIntoTable('user_access', ['user_id', 'password', 'permission'], [userId, hash, 'client']);
      console.log(access);
      if (access.affectedRows > 0) {
        const detailsInsert = await createSQLQuery.insertIntoTable('user_details', ['user_id', 'user_name', 'first_name', 'last_name', 'email', 'phone'], [userId, req.body.username, req.body.firstName, req.body.lastName, , req.body.email, req.body.phone]);
        if (access.affectedRows > 0) {
          res.send(true);

        } else {
          res.send(false);

          console.log(`user_details for ${username} injected`);
        }

      }
      else {
        res.send(false);
        console.log(`user_access for ${username} injected`);
      }
    }
  });

});


router.post('/logIn', async function (req, res) {

  const data = await createSQLQuery.sqlSelect({
    distinct: false,
    columns: ['user_access.password, user_access.user_id , user_details.client_id'],
    tableName: "user_details",
    where: `user_name = '${req.body.username}'`,
    orderBy: [],
    join: ['user_access on user_access.user_id = user_details.user_id']
  });
  console.log('data: ', data);
  if (data.length > 0) {
    bcrypt.compare(req.body.password, data[0].password, function (err, result) {
      if (result) {
        console.log('userId:', data[0].user_id);
        res.cookie('userId', data[0].user_id, {
          httpOnly: false,
          expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000)
        });

        res.send(JSON.stringify(data[0].client_id));
        console.log("Login successful");

      }
      else {
        res.send(false);
      }
    });

  } else {
    console.log("Login unsuccessful");
    res.send(false);
  }
});

router.post('/changePassword', async function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
    const data = await createSQLQuery.updateTable('user_access', `user_details`, `user_access.user_id = user_details.user_id`, ['password'], [`'${hash}'`], [`email='${req.body.email}'`]);
    console.log('data:' + data);
    if (data.affectedRows > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});


router.post('/password', async function (req, res) {
  const data = await createSQLQuery.sqlSelect({
    distinct: false,
    columns: ['user_details.user_name'],
    tableName: "user_details",
    where: `email = '${req.body.email}'`,
    orderBy: [],
    join: []
  });
  if (data.length > 0) {
    let mailOptions = {
      from: 'tripifycompany@gmail.com',
      to: `${req.body.email}`,
      subject: 'Change password',
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


module.exports = router;




