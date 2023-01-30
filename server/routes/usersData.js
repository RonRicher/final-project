const express = require('express');
const router = express.Router();
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');


router.get('/deals', async function (req, res) {
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['deal_package.deal_id', 'deal_package.location', 'deal_package.start_date',
            'deal_package.end_date', 'deal_package.price', 'deal_package.car',
            'deal_package.description', 'hotel.hotel_name'],
        tableName: "deal_package",
        where: ``,
        orderBy: [],
        join: ['hotel on deal_package.hotel_id = hotel.hotel_id']
    });
    console.log(data);
    let arr = [];
    data.forEach(deal => {
        arr.push({
            id: deal.deal_id,
            location: deal.location,
            startDate: deal.start_date,
            endDate: deal.end_date,
            price: deal.price,
            car: deal.car,
            description: deal.description,
            hotelName: deal.hotel_name
        });
    });
    console.log(arr);
    res.send(JSON.stringify(arr));

});


router.get('/dealInfo', async function (req, res) {
    const { dealId } = req.query;
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['flight.airline', 'flight.start_location', 'flight.destination', 'flight.flight_date', 'flight.departure', 'flight.arriving'],
        tableName: "deal_package",
        where: `deal_id = ${dealId}`,
        orderBy: [],
        join: ['flight on deal_package.outbound_flight_id = flight.flight_id or deal_package.inbound_flight_id = flight.flight_id']
    });
    console.log(data);
    let arr = [];
    data.forEach(flight => {
        arr.push({
            airline: flight.airline,
            startLocation: flight.start_location,
            destination: flight.destination,
            date: flight.flight_date,
            departure: flight.departure,
            arriving: flight.arriving,

        });
    });
    console.log(arr);
    res.send(JSON.stringify(arr));

});



module.exports = router;
