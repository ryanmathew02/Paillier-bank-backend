const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require("bcrypt")
const saltRounds = 10;

const login = mongoose.Schema({
    accountID: String,
    LoginPassword: String,
    TranscationPassword: String,
    userID: { type: Schema.Types.ObjectId, ref: 'User' }
})

// run this function before saving the object in DB
login.pre('save', async function (next) {
    console.log("pre function model->Logins")
    this.LoginPassword = await bcrypt.hash(this.LoginPassword, saltRounds);
    this.TranscationPassword = await bcrypt.hash(this.TranscationPassword, saltRounds);
    next();
})

login.statics.checkLogin = async function (accountID, LoginPassword) {
    console.log("CheckLgoin");
    const user = await this.findOne({
        accountID: accountID
    });
    if (user) {
        const check = await bcrypt.compare(LoginPassword, user.LoginPassword);
        if (check) {
            console.log("Correct Credetials");
            return user;
        } else {
            throw Error("Wrong password");
        }
    } else {
        throw Error('No such user')
    }
}

module.exports.Login = mongoose.model('Login', login);