const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');
const permission = require('../permission');



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


router.get('/search/location', async function (req, res) {
    const { search } = req.query;
    const data = await createSQLQuery.sqlSelect({
        distinct: true,
        columns: ['location'],
        tableName: "deal_package",
        where: `location LIKE '${search}%'`,
        orderBy: [],
        join: []
    });
    const arr = [];
    data.forEach((location) => arr.push(location.location));
    res.send(arr);
});

router.get('/search/hotels', async function (req, res) {
    const { location } = req.query;
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['hotel_id', 'hotel_name'],
        tableName: "hotel",
        where: `location = '${location}'`,
        orderBy: [],
        join: []
    });
    const arr = [];
    data.forEach((hotel) => arr.push({
        hotelId: hotel.hotel_id,
        hotelName: hotel.hotel_name
    }));
    res.send(arr);
});

router.get('/search/flights/outbound', async function (req, res) {
    const { location } = req.query;
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['flight_id', 'airline', 'flight_date'],
        tableName: "flight",
        where: `destination = '${location}' and start_location='Tel Aviv'`,
        orderBy: [],
        join: []
    });
    const arr = [];
    data.forEach((flight) => arr.push({
        flightId: flight.flight_id,
        airline: flight.airline,
        date: flight.flight_date
    }));
    res.send(arr);
});

router.get('/search/flights/inbound', async function (req, res) {
    const { location,flightId} = req.query;
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['flight_id', 'airline', 'flight_date'],
        tableName: "flight",
        where: `start_location = '${location}' and destination='Tel Aviv' and flight_date > (SELECT flight_date FROM flight WHERE flight_id = ${flightId})`,
        orderBy: [],
        join: []
    });
    const arr = [];
    data.forEach((flight) => arr.push({
        flightId: flight.flight_id,
        airline: flight.airline,
        date: flight.flight_date
    }));
    res.send(arr);
});
module.exports = router;
