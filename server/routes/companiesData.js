const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');
const permission = require('../permission');


router.get('/',permission, async function (req, res) {
    if (res.locals.permission !== 'admin' && res.locals.permission !== 'company') {
        res.send(false);
        return;
    }
    const companyId = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['company_id'],
        tableName: "company_details",
        where: `user_id = '${req.cookies.userId}'`,
        orderBy: [],
        join: []
    })
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['SUM(quantity) as quantity', 'client_deal.deal_id' ],
        tableName: "client_deal ",
        where: `company_id = ${companyId[0].company_id}`,
        orderBy: [],
        join: ['deal_package ON client_deal.deal_id = deal_package.deal_id'],
        groupBy: 'client_deal.deal_id'
    });
    console.log(data);
    const arr = [];
    data.forEach((deal) => arr.push({
       dealId: deal.deal_id,
       quantity: deal.quantity
    }));
    res.send(arr);
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
    const data = await createSQLQuery.updateTable('user_access', `company_details`, `user_access.user_id = company_details.user_id`, ['permission'], ['company'], [`company_details.company_name='${req.body.companyName}'`]);
    console.log('data:' + data);
    if (data.affectedRows > 0) {
        const data = await createSQLQuery.updateTable('company_request', `company_details`, `company_request.company_name = company_details.company_name`, ['deleted'], ['1'], [`company_details.company_name='${req.body.companyName}'`]);
        console.log('data:' + data);
        if (data.affectedRows > 0) {
            res.send(true);
        } else {
            res.send(false);
        }
    } else {
        res.send(false);
    }
});

router.delete('/requests/decline', permission, async function (req, res) {
    if (res.locals.permission !== 'admin') {
        res.send(false);
        return;
    }
    const data = await createSQLQuery.updateTable('company_request', `company_details`, `company_request.company_name = company_details.company_name`, ['deleted'], ['1'], [`company_details.company_name='${req.body.companyName}'`]);
    console.log('data:' + data);
    if (data.affectedRows > 0) {
        const data = await createSQLQuery.updateTable('user_access', `company_details`, `user_access.user_id = company_details.user_id`, ['permission'], ['declined'], [`company_details.company_name='${req.body.companyName}'`]);
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
