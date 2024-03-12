const nodemailer = require('nodemailer');

const NodeMailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'orewaspidermande@gmail.com',
        pass: process.env.mailPassword
    }
});

module.exports = { NodeMailer }