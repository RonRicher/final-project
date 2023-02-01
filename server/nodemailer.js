var nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tripifycompany@gmail.com',
        pass: 'xjxpvpixjtbnzois'

    }
});

module.exports = transporter;