const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');




router.post('/createDeal', async function (req, res) {
    const { companyId, hotelId, location, startDate,
        endDate, outboundFlightId, inboundFlightId,
        price, car, description } = req.body;
    const values = [companyId, hotelId, location, startDate,
        endDate, outboundFlightId, inboundFlightId,
        price, car, description];
    const fields = [
        'company_id', 'hotel_id', 'location', 'start_date',
        'end_date', 'outbound_flight_id', 'inbound_flight_id',
        'price', 'car', 'description'
    ];
    const data = await createSQLQuery.insertIntoTable(
        'deal_package', fields, values
    );
    console.log(data);

});


module.exports = router;
