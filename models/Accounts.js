const { boolean } = require("mathjs");
const mongoose = require("mongoose");
const { User } = require("./User");
const { Benif } = require("./Benificiary");
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
        Benif.create({
            userID: new mongoose.Types.ObjectId(rese._id),
            accountID: this.accountID
        }).then(result => {
            console.log(result);
        })
    })
})

module.exports.Accounts = mongoose.model('account', accounts);