const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');




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


router.get('/requests', async function (req, res) {
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

router.put('/requests/accept', async function (req, res) {
    const data = await createSQLQuery.updateTable('user_access', `company_details`, `user_access.user_id = company_details.user_id`, ['permission'], ['company'], [`company_details.company_name='${req.body.companyName}'`]);
    console.log('data:' + data);
    if (data.affectedRows > 0) {
        res.send(true);
    } else {
        res.send(false);
    }
});

router.delete('/requests/decline', async function (req, res) {
    const data = await createSQLQuery.updateTable('company_request', `company_details`, `company_request.company_name = company_details.company_name`, ['deleted'], [1], [`company_details.company_name='${req.body.companyName}'`]);
    console.log('data:' + data);
    if (data.affectedRows > 0) {
        res.send(true);
    } else {
        res.send(false);
    }
});
module.exports = router;
