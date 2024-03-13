const { default: mongoose } = require("mongoose");

const benif = mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    list: [{
        userID: {
            accountNumber: String,
            branch: String,
            IFSC: String
        },
        publicKey: {
            n: { type: String, required: true },
            g: { type: String, required: true },
            r: { type: String, required: true }
        }
    }]
})

module.exports.Benif = mongoose.model('Benificiary', benif);