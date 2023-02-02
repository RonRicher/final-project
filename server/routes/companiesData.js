const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');
const permission = require('../permission');
const transporter = require('../nodemailer');



// Router sends different data based on user permission
router.get('/', permission, async function (req, res) {
    if (res.locals.permission !== 'admin' && res.locals.permission !== 'company') {
        res.send(false);
        return;
    } 
    if(res.locals.permission === 'admin'){
        const data = await createSQLQuery.sqlSelect({
            distinct: false,
            columns: ['SUM(quantity) as quantity','SUM(client_deal.price) as totalPrice', 'company_details.company_name'],
            tableName: "deal_package",
            where: ``,
            orderBy: [],
            join: ['client_deal ON deal_package.deal_id = client_deal.deal_id join company_details on deal_package.company_id = company_details.company_id'],
            groupBy: 'deal_package.company_id',
        });
        const arr = [];
        data.forEach((company) => arr.push({
            companyName: company.company_name,
            totalQuantity: company.quantity,
            totalPrice: company.totalPrice
        }));
        res.send(arr);
        return;
    }
    else{
        const companyId = await createSQLQuery.sqlSelect({
            distinct: false,
            columns: ['company_id'],
            tableName: "company_details",
            where: `user_id = '${req.cookies.userId}'`,
            orderBy: [],
            join: []
        });
        const data = await createSQLQuery.sqlSelect({
            distinct: false,
            columns: ['SUM(quantity) as quantity', 'client_deal.deal_id','deal_package.price'],
            tableName: "client_deal ",
            where: `company_id = '${companyId[0].company_id}'`,
            orderBy: [],
            join: ['deal_package ON client_deal.deal_id = deal_package.deal_id'],
            groupBy: 'client_deal.deal_id'
        });
        const arr = [];
        data.forEach((deal) => arr.push({
            dealId: deal.deal_id,
            quantity: deal.quantity,
            price: deal.price
        }));
        res.send(arr);
    }
 
});

router.get('/hotels', async function (req, res) {
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['*'],
        tableName: "hotel",
        where: ``,
        orderBy: [],
        join: []
    });
    let arr = [];
    data.forEach(hotel => {
        arr.push({
            id: hotel.hotel_id,
            name: hotel.hotel_name,
            location: hotel.location,
            roomsLeft: hotel.rooms_left,
            price: hotel.price
        });
    });
    console.log(arr);
    res.send(JSON.stringify(arr));

});


router.get('/flights', async function (req, res) {
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['*'],
        tableName: "flight",
        where: ``,
        orderBy: [],
        join: []
    });
    let arr = [];
    data.forEach(flight => {
        arr.push({
            id: flight.flight_id,
            airline: flight.airline,
            startLocation: flight.start_location,
            destination: flight.destination,
            flightDate: flight.flight_date,
            departure: flight.departure,
            arriving: flight.arriving,
            price: flight.price
        });
    });
    res.send(JSON.stringify(arr));

});


router.get('/requests', permission, async function (req, res) {
    if (res.locals.permission !== 'admin') {
        res.send(false);
        return;
    }
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['*'],
        tableName: "company_request",
        where: `company_request.deleted = 0`,
        orderBy: [],
        join: []
    });
    let arr = [];
    data.forEach(request => {
        arr.push({
            companyName: request.company_name,
            companyEmail: request.company_email,
            companyPhone: request.company_phone
        });
    });
    console.log(arr);
    res.send(JSON.stringify(arr));

});

router.put('/requests/accept', permission, async function (req, res) {
    if (res.locals.permission !== 'admin') {
        res.send(false);
        return;
    }
    const { companyEmail, companyName } = req.body;
    const data = await createSQLQuery.updateTable('user_access', `company_details`, `user_access.user_id = company_details.user_id`, ['permission'], ["'company'"], [`company_details.company_name='${companyName}'`]);
    console.log('data:' + data);
    if (data.affectedRows > 0) {
        const data = await createSQLQuery.updateTable('company_request', `company_details`, `company_request.company_name = company_details.company_name`, ['deleted'], ['1'], [`company_details.company_name='${companyName}'`]);
        console.log('data:' + data);
        if (data.affectedRows > 0) {
            res.send(true);
            let mailOptions = {
                from: 'tripifycompany@gmail.com',
                to: `${companyEmail}`,
                subject: `Your request to sign up to Tripify is been confirmed`,
                text: `Thanks for joining us to tripify, we're looking forward to giving you the best experience`
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
    } else {
        res.send(false);
    }
});

router.delete('/requests/decline', permission, async function (req, res) {
    const { companyName } = req.body;
    if (res.locals.permission !== 'admin') {
        res.send(false);
        return;
    }
    const data = await createSQLQuery.updateTable('company_request', `company_details`, `company_request.company_name = company_details.company_name`, ['deleted'], ['1'], [`company_details.company_name='${companyName}'`]);
    console.log('data:' + data);
    if (data.affectedRows > 0) {
        console.log('not working');
        const data = await createSQLQuery.updateTable('user_access', `company_details`, `user_access.user_id = company_details.user_id`, ['permission'], ["'declined'"], [`company_details.company_name='${companyName}'`]);
        if (data.affectedRows > 0) {
            res.send(true);
        } else {
            res.send(false);
        }
    } else {
        res.send(false);
    }
});

module.exports = router;
