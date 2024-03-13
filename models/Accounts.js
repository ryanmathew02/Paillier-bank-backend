const { boolean } = require("mathjs");
const mongoose = require("mongoose");
const { User } = require("./User");
var Schema = mongoose.Schema;


const accounts = mongoose.Schema({
    balance: String,
    accountID: { type: String, required: true, unique: true },
    transaction: [{
        to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        recieved: Boolean,
        sent: Boolean,
        ammout: String
    }],
    userID: { type: Schema.Types.ObjectId, ref: 'User' }
})

accounts.pre('save', async function () {
    await User.findOne({ accountID: this.accountID }).then(rese => {
        console.log("pre save accounts ", rese, rese._id);
        this.userID = new mongoose.Types.ObjectId(rese._id);
    })
})

module.exports.Accounts = mongoose.model('account', accounts);