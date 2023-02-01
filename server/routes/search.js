const express = require('express');
const router = express.Router();
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
        columns: ['hotel_id', 'hotel_name', 'price', 'rooms_left'],
        tableName: "hotel",
        where: `location = '${location}' and rooms_left > 0 and deleted = 0`,
        orderBy: [],
        join: []
    });
    const arr = [];
    data.forEach((hotel) => arr.push({
        hotelId: hotel.hotel_id,
        hotelName: hotel.hotel_name,
        price: hotel.price,
        reservations: hotel.rooms_left
    }));
    console.log(arr);
    res.send(arr);
});

router.get('/flights/outbound', async function (req, res) {
    const { location } = req.query;
    console.log('location: ', location);
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['flight_id', 'airline', 'flight_date', 'price'],
        tableName: "flight",
        where: `destination = '${location}' and start_location='Tel-Aviv'`,
        orderBy: [],
        join: []
    });
    function convertToSQLDate(dateStr) {
        const date = new Date(dateStr);
        return date.toISOString().split("T")[0];
    }
    console.log('data: ', data);
    const arr = [];
    data.forEach((flight) => arr.push({
        flightId: flight.flight_id,
        airline: flight.airline,
        date: convertToSQLDate(flight.flight_date),
        price: flight.price
    }));
    console.log('arr: ', arr);
    res.send(arr);
});

router.get('/flights/inbound', async function (req, res) {
    const { location, flightId } = req.query;
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['flight_id', 'airline', 'flight_date', 'price'],
        tableName: "flight",
        where: `start_location = '${location}' and destination='Tel-Aviv' and flight_date > (SELECT flight_date FROM flight WHERE flight_id = ${flightId})`,
        orderBy: [],
        join: []
    });
    function convertToSQLDate(dateStr) {
        const date = new Date(dateStr);
        return date.toISOString().split("T")[0];
    }
    const arr = [];
    data.forEach((flight) => arr.push({
        flightId: flight.flight_id,
        airline: flight.airline,
        date: convertToSQLDate(flight.flight_date),
        price: flight.price
    }));
    res.send(arr);
});

module.exports = router;