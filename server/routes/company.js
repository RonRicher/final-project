const express = require('express');
const router = express.Router();
const transporter = require('../nodemailer');
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const permission = require('../permission.js');



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
            res.status(400).send(JSON.stringify('username or email or phone already exists'));
            return;
        } else {
            const access = await createSQLQuery.insertIntoTable('user_access', ['user_id', 'password', 'permission'], [userId, hash, 'pending']);
            console.log(access);
            if (access.affectedRows > 0) {
                const detailsInsert = await createSQLQuery.insertIntoTable('company_details', ['user_id', 'company_name', 'location', 'email', 'phone'], [userId, req.body.companyName, req.body.location, req.body.email, req.body.phone]);
                if (access.affectedRows > 0) {
                    const requestTable = await createSQLQuery.insertIntoTable('company_request', ['company_name, company_email, company_phone, deleted'], [req.body.companyName, req.body.email, req.body.phone, '0']);
                    if (requestTable.affectedRows > 0) {
                        res.status(200).send();
                    }
                    else {
                        res.status(400).send();
                    }
                } else {
                    res.status(400).send();
                }
            }
            else {
                res.status(400).send();
            }
        }
    });
});


router.post('/logIn', async function (req, res) {
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['user_access.permission', 'user_access.user_id', 'user_access.password'],
        tableName: "company_details",
        where: `company_name = '${req.body.companyName}'`,
        orderBy: [],
        join: ['user_access on user_access.user_id = company_details.user_id']
    });
    console.log('data: ', data);
    if (data.length > 0) {
        bcrypt.compare(req.body.password, data[0].password, function (err, result) {
            if (result) {
                if (data[0].permission === 'declined') {
                    res.status(400).send(JSON.stringify('You declined by the Admin'));
                    return;
                }
                if (data[0].permission === 'pending') {
                    res.status(400).send(JSON.stringify('Youre still pending...'));
                    return;
                } else {
                    res.cookie('userId', data[0].user_id, {
                        httpOnly: false,
                        expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000)
                    });
                    res.send(JSON.stringify(data[0].permission));
                }
            }
            else {
                res.status(400).send();
                return;
            }
        });
    } else {
        res.status(400).send();
        return;
    }
});

router.post('/changePassword', async function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
        const data = await createSQLQuery.updateTable('user_access', `company_details`, `user_access.user_id = company_details.user_id`, ['password'], [`'${hash}'`], [`email='${req.body.email}'`]);
        if (data.affectedRows > 0) {
            res.status(200).send();
        } else {
            res.status(400).send();
        }
    });
});

// Router posts to change password, email verify, send link via transporter
router.post('/password', async function (req, res) {
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['company_details.company_name'],
        tableName: "company_details",
        where: `email = '${req.body.email}'`,
        orderBy: [],
        join: []
    });
    console.log('data: ', data);
    if (data.length > 0) {
        console.log(2222222);
        let mailOptions = {
            from: 'tripifycompany@gmail.com',
            to: `${req.body.email}`,
            subject: 'Change password',
            text: 'click on the link to reset your password http://localhost:4000/changePassword'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                res.status(200).send();
            }
        });
    } else {
        res.status(400).send();
    }
});


module.exports = router;




