const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');




router.post('/', async function (req, res) {
    const { companyId, hotelId, location, startDate,
        endDate, outboundFlightId, inboundFlightId,
        price, car, description, reservations } = req.body;
    const values = [companyId, hotelId, location, startDate,
        endDate, outboundFlightId, inboundFlightId,
        price, car, description, reservations];
    const fields = [
        'company_id', 'hotel_id', 'location', 'start_date',
        'end_date', 'outbound_flight_id', 'inbound_flight_id',
        'price', 'car', 'description', 'reservations'
    ];
    const data = await createSQLQuery.insertIntoTable(
        'deal_package', fields, values
    );
    if (data.affectedRows > 0) {
        console.log(typeof Number(reservations));
        const updateRooms = await createSQLQuery.updateTable('hotel', `deal_package`, `hotel.hotel_id = deal_package.hotel_id`, ['rooms_left'], [`rooms_left - ${Number(reservations)}`], [`hotel.hotel_id = '${hotelId}'`]);
    }
    console.log(data);

});


module.exports = router;
