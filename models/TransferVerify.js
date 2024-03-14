const mongoose = require("mongoose");

const verify = mongoose.Schema({
    from: String,
    to: String,
    code: String,
    verified: Boolean,
})

module.exports.Payverify = mongoose.model('PaymentVerify', verify);