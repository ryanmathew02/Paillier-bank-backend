const mongoose = require("mongoose");
const { User } = require("./User");

const Key = mongoose.Schema({
    accountID: { type: String, required: true, unique: true },
    publicKey: {
        n: { type: String, required: true },
        g: { type: String, required: true },
        r: { type: String, required: true }
    },
    privateKey: {
        gMu: { type: String, required: true },
        gLambda: { type: String, required: true }
    },
})

Key.post('save', async function () {
    console.log("Key save post function");
    await User.findOneAndUpdate({
        accountID: this.accountID
    }, {
        keys: new mongoose.Types.ObjectId(this._id)
    })
})

module.exports.Key = mongoose.model('Key', Key);