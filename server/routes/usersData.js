const express = require('express');
const router = express.Router();
const con = require('../connection.js');
const createSQLQuery = require('../createSqlQuery.js');
var nodemailer = require('nodemailer');
const permission = require('../permission.js');


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'elyasaf11@gmail.com',
        pass: 'yfkpuiockfqgykvr'
    }
});

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
        columns: ['flight.airline', 'flight.start_location',
            'flight.destination', 'flight.flight_date',
            'flight.departure', 'flight.arriving',
            'deal_package.deal_id', 'deal_package.location',
            'deal_package.start_date', 'deal_package.reservations',
            'deal_package.end_date', 'deal_package.price',
            'deal_package.car',
            'deal_package.description', 'hotel.hotel_name'],
        tableName: "deal_package",
        where: `deal_id = ${dealId}`,
        orderBy: [],
        join: ['flight on deal_package.outbound_flight_id = flight.flight_id or deal_package.inbound_flight_id = flight.flight_id join hotel on deal_package.hotel_id = hotel.hotel_id']
    });
    console.log(data);
    const dataInfo = [];
    const dealInfo = {
        location: data[0].location, startDate: data[0].start_date,
        endDate: data[0].end_date, price: data[0].price,
        car: data[0].car, description: data[0].description,
        hotelName: data[0].hotel_name,
        reservations: data[0].reservations
    };
    dataInfo.push(dealInfo);
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
    dataInfo.push(arr);
    console.log(dataInfo);
    res.send(JSON.stringify(dataInfo));

});

router.post('/payment',permission, async function (req, res) {
    if (res.locals.permission !== 'admin' && res.locals.permission !== 'client') {
        res.send(false);
        return;
    }
    const { dealId, clientId, quantity, price, firstName, lastName,
        phone, email, prevReservations, random,location } = req.body;
    const data = await createSQLQuery.insertIntoTable('client_deal', ['deal_id', 'client_id', 'quantity', 'price', 'res_number'], [dealId, clientId, quantity, price, random]);
    console.log('data.affectedRows:', data.affectedRows);
    if (data.affectedRows > 0) {
        console.log('prevReservation: ', prevReservations);
        const changeReservations = await createSQLQuery.updateTable('deal_package', `client_deal`, `deal_package.deal_id = client_deal.deal_id`, ['reservations'], [`reservations - ${Number(quantity)}`], [`deal_package.deal_id = '${dealId}'`]);
        let mailOptions = {
            from: 'elyasaf11@gmail.com',
            to: `${email}`,
            subject: `Your reservation to Paris`,
            text: `Thanks for joining us to ${location}, for this trip you paid ${price} for ${quantity} people`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                res.send(true);
            }
        });
    }

});

router.post('/trip/payment',permission, async function (req, res) {
    if (res.locals.permission !== 'admin' && res.locals.permission !== 'client') {
        res.send(false);
        return;
    }
    const { clientId, price, firstName, lastName,
        phone, email, quantity, random,location } = req.body;
    const data = await createSQLQuery.insertIntoTable('client_trip', ['client_id', 'quantity', 'price', 'res_number'], [clientId, quantity, price, random]);
    console.log('data.affectedRows:', data.affectedRows);
    if (data.affectedRows > 0) {
        let mailOptions = {
            from: 'elyasaf11@gmail.com',
            to: `${email}`,
            subject: `Your reservation Number ${random} to ${location}`,
            text: `Thanks for joining us to ${location}, for this trip you paid ${price}$ for ${quantity} people`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                res.send(true);
            }
        });
    }

});

router.get('/search', async function (req, res) {
    const { location, type, startDate, endDate } = req.query;
    console.log(req.query);
    const data = await createSQLQuery.sqlSelect({
        distinct: false,
        columns: ['deal_package.deal_id', 'deal_package.location', 'deal_package.start_date',
            'deal_package.end_date', 'deal_package.price', 'deal_package.car',
            'deal_package.description', 'hotel.hotel_name'],
        tableName: "deal_package",
        where: `deal_package.location LIKE '%${location}%' 
        AND description LIKE '%${type}%' ${startDate ? ` And start_date >= '${startDate}'` : ''}
         ${endDate ? ` And end_date <= '${endDate}'` : ''}`,
        orderBy: [],
        join: ['hotel on deal_package.hotel_id = hotel.hotel_id']
    });
    const arr = [];
    data.forEach((deal) => arr.push({
        id: deal.deal_id,
        location: deal.location,
        startDate: deal.start_date,
        endDate: deal.end_date,
        price: deal.price,
        car: deal.car,
        description: deal.description,
        hotelName: deal.hotel_name
    }));
    res.send(arr);
});

router.get('/search/location', async function (req, res) {
    const { search } = req.query;
    const data = await createSQLQuery.sqlSelect({
        distinct: true,
        columns: ['location'],
        tableName: "deal_package",
        where: `location LIKE '${search}%'`,
        orderBy: [],
        join: []
    });
    const arr = [];
    data.forEach((location) => arr.push(location.location));
    res.send(arr);
});



module.exports = router;
