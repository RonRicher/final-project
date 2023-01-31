const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');
const permission = require('../permission');

router.get('/location', async function (req, res) {
    const { search } = req.query;
    const data = await createSQLQuery.sqlSelect({
        distinct: true,
        columns: ['location'],
        tableName: "hotel",
        where: `location LIKE '${search}%'`,
        orderBy: [],
        join: []
    });
    const arr = [];
    data.forEach((location) => arr.push(location.location));
    res.send(arr);
});

router.get('/hotels', async function (req, res) {
    const { location } = req.query;
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['hotel_id', 'hotel_name','price'],
        tableName: "hotel",
        where: `location = '${location}'`,
        orderBy: [],
        join: []
    });
    const arr = [];
    data.forEach((hotel) => arr.push({
        hotelId: hotel.hotel_id,
        hotelName: hotel.hotel_name,
        price: hotel.price
    }));
    res.send(arr);
});

router.get('/flights/outbound', async function (req, res) {
    const { location } = req.query;
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['flight_id', 'airline', 'flight_date','price'],
        tableName: "flight",
        where: `destination = '${location}' and start_location='Tel Aviv'`,
        orderBy: [],
        join: []
    });
    const arr = [];
    data.forEach((flight) => arr.push({
        flightId: flight.flight_id,
        airline: flight.airline,
        date: flight.flight_date,
        price: flight.price
    }));
    res.send(arr);
});

router.get('/flights/inbound', async function (req, res) {
    const { location,flightId} = req.query;
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['flight_id', 'airline', 'flight_date','price'],
        tableName: "flight",
        where: `start_location = '${location}' and destination='Tel Aviv' and flight_date > (SELECT flight_date FROM flight WHERE flight_id = ${flightId})`,
        orderBy: [],
        join: []
    });
    const arr = [];
    data.forEach((flight) => arr.push({
        flightId: flight.flight_id,
        airline: flight.airline,
        date: flight.flight_date,
        price: flight.price
    }));
    res.send(arr);
});

module.exports = router;