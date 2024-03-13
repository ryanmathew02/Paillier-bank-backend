const { boolean } = require("mathjs");
const mongoose = require("mongoose");
var Schema = mongoose.Schema;


const user = mongoose.Schema({
    firstName: String,
    lastName: String,
    accountNumber: String,
    panNumber: String,
    accountID: String,
    phoneNumber: String,
    email: { type: String, unique: true },
    netBankEnable: { type: boolean, "default": false },
    keys: { type: Schema.Types.ObjectId, ref: 'Key' }
})

module.exports.User = mongoose.model('User', user);