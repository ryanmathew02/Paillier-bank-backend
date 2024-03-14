const { Key } = require("../models/Keys");
const { Payverify } = require("../models/TransferVerify")
const { NodeMailer } = require("../utils/NodeMailer");
const { encryption } = require("../utils/paillier-algo");
const { userBalanceUpdate } = require("../utils/paillier-ops");

async function getKEYS(accountID) {
    const result = await Key.findOne({ accountID });
    console.log("sender's public key ", result, result.publicKey);
    return result.publicKey;
}

const sendPayMail = (req, res) => {
    const decoded = req.decoded;
    const sendTo = req.body.sendTo
    console.log("send mail payment", decoded, sendTo);
    var randomstring = Math.random().toString(36).slice(-8);
    const mailOptions = {
        from: 'orewaspidermande@gmail.com',
        to: decoded.email,
        subject: 'Payment Verification',
        text: `We have a request for initializing a Payment from Account number ! 
        ${decoded.accountnumber} to ${sendTo.userID.accountID} Holder:${sendTo.userID.Name}  
        ** Security Code ${randomstring} **`
    };

    NodeMailer.sendMail(mailOptions, async function (error, info) {
        if (error) {
            console.log("Error While sending mail", error);
            new Error("Error While sending mail");
        } else {
            console.log('Email sent: ' + info.response);
            Payverify.create({
                from: decoded.accountID,
                to: sendTo.userID.accountID,
                code: randomstring,
                verified: false
            }).then(result => {
                res.status(200).json({
                    message: "Mail Sent, Please Verify"
                })
            }).catch(err => {
                res.status(400).json({
                    message: "error in payment auth"
                })
            })
        }
    })
}

const makeTransaction = (req, res) => {
    const amount = req.body.ammount;
    const transactionPassword = req.body.password;
    const code = req.body.code;
    const decoded = req.decoded;
    const sendTo = req.body.sendTo;
    console.log("makePayment API", amount, transactionPassword, code, decoded, sendTo);

    Payverify.findOne({
        $and: [
            {
                from: decoded.accountID,
            },
            {
                to: sendTo.userID.accountID,
            },
            {
                verified: false
            },
            {
                code: code
            }
        ]
    }).then(async result => {
        if (result) {
            console.log("verify pay ", result);
            const recieverOperated = encryption(sendTo.publicKey, amount);
            const sendKeys = await getKEYS(decoded.accountID);
            console.log("send public key", sendKeys);
            const sendOpeartedValue = await encryption(sendKeys, amount);
            console.log("send operated value ", sendOpeartedValue);
            await userBalanceUpdate(sendTo, recieverOperated, true);
            await userBalanceUpdate(decoded, sendOpeartedValue, false);
        } else {
            console.log("wrong Code");
            res.status(400).json({
                message: "wrong Code"
            })
        }
    })
}

module.exports = { sendPayMail, makeTransaction }