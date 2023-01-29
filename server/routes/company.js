const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'elyasaf11@gmail.com',
        pass: 'yfkpuiockfqgykvr'
    }
});

router.post('/register', async function (req, res) {

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    const companyNameRegex = /^[a-zA-Z0-9._-]{3,15}$/;
    const phoneRegex = /^(?:\+\d{1,3}|0\d{1,3}|\d{1,4})[\s.-]?\d{3}[\s.-]?\d{4}$/;

    if (!companyNameRegex.test(req.body.companyName)) {
        console.log("Please enter a valid companyName");
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
            tableName: "company_details",
            where: `company_name = '${req.body.companyName}' OR email = '${req.body.email}' OR phone = '${req.body.phone}'`,
            orderBy: [],
            join: []
        });
        if (data.length > 0) {
            console.log("Username or email or phone-number already exists");
            return;
        } else {
            const access = await createSQLQuery.insertIntoTable('user_access', ['user_id', 'password', 'permission'], [userId, hash, 'pending']);
            console.log(access);
            if (access.affectedRows > 0) {
                const detailsInsert = await createSQLQuery.insertIntoTable('company_details', ['user_id', 'company_name', 'location', 'email', 'phone'], [userId, req.body.companyName, req.body.location, req.body.email, req.body.phone]);
                if (access.affectedRows > 0) {
                    const requestTable = await createSQLQuery.insertIntoTable('company_request', ['company_name, company_email, company_phone, deleted'], [req.body.companyName, req.body.email, req.body.phone, '0']);
                    if (requestTable.affectedRows > 0) {
                        res.send(true);
                    }
                    else {
                        res.send(false);
                        console.log(`company_request for ${companyName} injected`);
                    }
                } else {
                    res.send(false);
                    console.log(`company_details for ${companyName} injected`);
                }
            }
            else {
                res.send(false);
                console.log(`user_access for ${companyName} injected`);
            }
        }
    });
});


router.post('/logIn', async function (req, res) {
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['user_access.permission', 'user_access.password'],
        tableName: "company_details",
        where: `company_name = '${req.body.companyName}'`,
        orderBy: [],
        join: ['user_access on user_access.user_id = company_details.user_id']
    });
    console.log('data: ', data);
    if (data.length > 0) {
        console.log('data');
        bcrypt.compare(req.body.password, data[0].password, function (err, result) {
            if (result) {
                if (data[0].permission === 'pending') {
                    console.log('you dont have permission yet');
                } else {
                    console.log("Login successful");
                    res.send(true);
                }
            }
            else {
                console.log('data false');
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
        const data = await createSQLQuery.updateTable('user_access', `company_details`, `user_access.user_id = company_details.user_id`, ['password'], [hash], [`email='${req.body.email}'`]);

        if (data.affectedRows > 0) {
            res.send(true);
        } else {
            res.send(false);
        }
    });
});


router.post('/password', function (req, res) {
    let sql = `select company_name from company_details where email = '${req.body.email}'`;
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




