const express = require('express');
const router = express.Router();
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');
const permission = require('../permission');


// Route POST handler with permission check, room availability, and trip reservation creation
router.post('/', permission, async function (req, res) {
    console.log(res.locals.permission);
    if (res.locals.permission !== 'admin' && res.locals.permission !== 'client') {
        res.status(400).send(JSON.stringify('You dont have permission'));
        console.log('stuck');
        return;
    }
    const { hotelId, location, outbound, inbound, quantity } = req.body;
    const roomsLeft = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['rooms_left'],
        tableName: "hotel",
        where: `hotel_id = '${hotelId}'`,
        orderBy: [],
        join: []
    });
    if (roomsLeft[0].rooms_left < Number(quantity)) {
        res.send(JSON.stringify('we are sorry but there is no rooms left'));
        return;
    } else {
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
            res.send(true);

        } else {
            res.send(false);
        }
    }
});


module.exports = router;