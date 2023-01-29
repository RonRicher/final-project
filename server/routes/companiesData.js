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
    flight_id, airline, start_location, destination, flight_date, departure, arriving, price

    data.forEach(flight => {
        arr.push({
            airline: flight.airline,
            startLocation: flight.start_location,
            destination: flight.destination,
            flightDate: flight_date,
            departure: flight.departure,
            arriving: flight.arriving,
            price: flight.price
        });
    });
    res.send(JSON.stringify(arr));

});
module.exports = router;
