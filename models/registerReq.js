const mongoose = require("mongoose");

const regisReq = mongoose.Schema({
    accountNumber: {
        unique: true,
        type: String,
    },
    reqTime: {
        type: Date, default: Date.now
    },
    securityCode: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
})

module.exports.RegisterRequest = mongoose.model('RegisterRequest', regisReq)