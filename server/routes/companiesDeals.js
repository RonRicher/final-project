const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');
const permission = require('../permission');

router.post('/', permission, async function (req, res) {
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
    console.log(companyId);
    const flights = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['flight_date'],
        tableName: "flight",
        where: `flight_id = '${req.body.outbound}' or flight_id = '${req.body.inbound}'`,
        orderBy: [],
        join: []
    })
    function convertToSQLDate(dateStr) {
        const date = new Date(dateStr);
        return date.toISOString().split("T")[0];
    }
    const start_date = convertToSQLDate(flights[0].flight_date);
    const end_date = convertToSQLDate(flights[1].flight_date);
    console.log(start_date, end_date);
    console.log(flights);
    const { hotelId, location, outbound, inbound,
        price, car, description, reservations } = req.body;
    const values = [companyId[0].company_id, hotelId, location, start_date,
        end_date, outbound, inbound,
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
