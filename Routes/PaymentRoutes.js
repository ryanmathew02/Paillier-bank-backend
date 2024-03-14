const express = require('express');
const { sendPayMail, makeTransaction } = require('../Controllers/PaymentController');
const { tokenHandler } = require('../middleware/authHandler');
const router = express.Router();


router.post('/getVerified', tokenHandler, sendPayMail);
router.post('/makePayment', tokenHandler, makeTransaction);

module.exports = router