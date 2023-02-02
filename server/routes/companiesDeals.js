const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');
const permission = require('../permission');


// Router handling POST request with permission, creating deal package with flight and hotel information, updating hotel room count
router.post('/', permission, async function (req, res) {
    if (res.locals.permission !== 'admin' && res.locals.permission !== 'company') {
        res.status(400).send(JSON.stringify('permission denied, please log in'))
        return;
    }
    const { hotelId, location, outbound, inbound,
        price, car, description, reservations } = req.body;
    const roomsLeft = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['rooms_left'],
        tableName: "hotel",
        where: `hotel_id = '${hotelId}'`,
        orderBy: [],
        join: []
    })
    if (roomsLeft[0].rooms_left < Number(reservations)) {
        res.status(400).send(JSON.stringify(`only ${roomsLeft[0].rooms_left} rooms left`));

    } else {
        const updateRooms = await createSQLQuery.updateTable('hotel', ``, ``, ['rooms_left'], [`rooms_left - ${Number(reservations)}`], [`hotel.hotel_id = '${hotelId}'`]);
        if (updateRooms.affectedRows > 0) {
            const companyId = await createSQLQuery.sqlSelect({
                distinct: false,
                columns: ['company_id'],
                tableName: "company_details",
                where: `user_id = '${req.cookies.userId}'`,
                orderBy: [],
                join: []
            })
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
                const roomsLeft = await createSQLQuery.sqlSelect({
                    distinct: false,
                    columns: ['rooms_left'],
                    tableName: "hotel",
                    where: `hotel_id = '${hotelId}'`,
                    orderBy: [],
                    join: []
                });
                if (roomsLeft[0].rooms_left === 0) {
                    const deleteHotel = await createSQLQuery.updateTable('hotel', ``, ``, ['deleted'], [1], [`hotel.hotel_id = ${hotelId}`]);
                    res.status(200).send()
                    return;
                }
                res.status(200).send();
                return;
            } else {
                res.status(400).send(JSON.stringify('there was a problem, please try again'));
                return;
            }
        }
    }

});


module.exports = router;
