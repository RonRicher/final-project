const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');
const permission = require('../permission');

router.post('/', permission, async function (req, res) {
    if (res.locals.permission !== 'admin' && res.locals.permission !== 'client') {
        res.send(false);
        return;
    }
    const flights = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['flight_date'],
        tableName: "flight",
        where: `flight_id = '${req.body.outbound}' or flight_id = '${req.body.inbound}'`,
        orderBy: [],
        join: []
    });
    function convertToSQLDate(dateStr) {
        const date = new Date(dateStr);
        return date.toISOString().split("T")[0];
    }
    const start_date = convertToSQLDate(flights[0].flight_date);
    const end_date = convertToSQLDate(flights[1].flight_date);

    const { hotelId, location, outbound, inbound, quantity } = req.body;
    const values = [hotelId, location, start_date,
        end_date, outbound, inbound, quantity];
    const fields = [
        'hotel_id', 'location', 'start_date',
        'end_date', 'outbound_flight_id', 'inbound_flight_id', 'quantity'
    ];
    const data = await createSQLQuery.insertIntoTable(
        'personal_trip', fields, values
    );
    if (data.affectedRows > 0) {
        const updateRooms = await createSQLQuery.updateTable('hotel', `deal_package`, `hotel.hotel_id = deal_package.hotel_id`, ['rooms_left'], [`rooms_left - ${Number(quantity)}`], [`hotel.hotel_id = '${hotelId}'`]);
        res.send(true);
    }
    console.log(data);

});


module.exports = router;