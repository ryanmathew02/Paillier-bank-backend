const asyncHanlder = require('express-async-handler');
const { NodeMailer } = require('../utils/NodeMailer');
const { User } = require('../models/User');

const { RegisterRequest } = require('../models/registerReq');
const { Login } = require('../models/Login');
const { default: mongoose } = require('mongoose');
const jwt = require("jsonwebtoken");
const { Key } = require('../models/Keys');
const { KeyGenerator } = require('../utils/KeyGenerator');
const { Accounts } = require('../models/Accounts');
const { decryption } = require('../utils/paillier-algo');



const UserLogin = asyncHanlder(async (req, res) => {
    console.log("Login Api is working");
    const accountID = req.body.accountID;
    const password = req.body.password;
    console.log(accountID, password);

    try {
        const user = await Login.checkLogin(accountID, password);
        console.log("login users", user);
        const plain = { accountID: user.accountID, userID: user.userID, email: user.userID.email, keys: user.userID.keys }
        const token = await jwt.sign(plain, process.env.JWT, { expiresIn: process.env.JWTAge });
        console.log(token);
        res.cookie('jwt', token, { maxAge: 900000, httpOnly: true, sameSite: 'none', secure: true })
        res.status(200).json({ message: "success" })
    } catch (err) {
        console.log(err);
        res.status(400).json({ err })
    }
}
)
const Register = asyncHanlder(async (req, res) => {
    try {
        console.log("register Api is working");
        const accountid = req.body.accountID;
        const accountnumber = req.body.accountNumber;
        const email = req.body.email;
        console.log(accountid, accountnumber, email)
        const userDetails = await User.findOne({
            $and: [
                {
                    accountID: { $eq: accountid }
                },
                {
                    accountNumber: { $eq: accountnumber }
                },
                {
                    email: { $eq: email }
                },
                {
                    netBankEnable: false
                }
            ]
        }).select('firstName lastName accountNumber accountID phoneNumber email')
        console.log(userDetails);
        console.log("Checking await User.js line-15");
        if (userDetails) {
            const del = await RegisterRequest.deleteOne({ accountNumber: accountnumber });
            if (del.acknowledged && del.deletedCount == 1)
                console.log("Record in request existed, deleted old one");
            else
                console.log("No previous request");

            var randomstring = Math.random().toString(36).slice(-8);

            const mailOptions = {
                from: 'orewaspidermande@gmail.com',
                to: email,
                subject: 'Mail Verification',
                text: `We have a request for initializing a Internet Banking of Account number ! ${accountnumber} Security Code ${randomstring}`
            };

            NodeMailer.sendMail(mailOptions, async function (error, info) {
                if (error) {
                    console.log("Error While sending mail", error);
                    new Error("Error While sending mail");
                } else {
                    console.log('Email sent: ' + info.response);
                    const newReq = new RegisterRequest({
                        accountNumber: accountnumber,
                        securityCode: randomstring,
                    })
                    await newReq.save().then(result => {
                        console.log("New Request registered");
                        res.json({
                            status: 200,
                            message: "New Request created",
                            userDetails: userDetails
                        })
                    }).catch(err => {
                        new Error("Error in Registering new request");
                        res.json({
                            status: 404,
                            message: "Error in Registering new request"
                        })
                    })
                }
            })
        } else {
            console.log("No Such account");
            res.status(200).json({
                status: 200,
                message: "No Such account, Or Credentials already exist"
            })
        }
    } catch (error) {
        console.log(error);
    }

})

const VerifyAccount = asyncHanlder(async (req, res) => {
    console.log("Verify is working");
    const code = req.body.code;
    const userDetails = req.body.userDetails;
    console.log(userDetails, code);

    const result = await RegisterRequest.findOneAndUpdate({
        $and: [
            {
                accountNumber: { $eq: userDetails.accountNumber }
            },
            {
                securityCode: { $eq: code }
            },
            {
                verified: { $eq: false }
            },
        ]
    }, { verified: true })
    console.log(result);
    if (result) {

        res.json({
            status: 200,
            message: "Account verified"
        })
    } else {
        res.json({
            status: 400,
            message: "NO record found"
        })
    }
})

const setPassword = asyncHanlder(async (req, resp) => {
    const transactionPassword = req.body.transactionPassword;
    const loginPassword = req.body.loginPassword;
    const userDetails = req.body.userDetails;

    const result = await RegisterRequest.findOneAndDelete({
        $and: [
            {
                accountNumber: { $eq: userDetails.accountNumber }
            },
            {
                verified: { $eq: true }
            },
        ]
    })
    console.log("setpass ", result)
    if (result) {
        KeyGenerator(userDetails.accountID, transactionPassword);
        Login.create({
            accountID: userDetails.accountID,
            LoginPassword: loginPassword,
            TranscationPassword: transactionPassword,
            userID: new mongoose.Types.ObjectId(userDetails._id)
        }).then(res => {
            console.log("created new credentials");
            resp.json({
                status: 200,
                message: "created new credentials"
            })
        }).catch(err => {
            console.log("error in creating new credentials");
            resp.json({
                status: 400,
                message: "error in creating new credentials"
            })
        })
    } else {
        console.log("Verification not done");
        resp.json({
            status: 400,
            message: "Verification not done"
        })
    }
})

const logout = (req, res) => {
    console.log("logout api");
}

const userDetails = async (req, res) => {
    console.log("get user details", req.decoded);
    const accountid = req.decoded.accountID;

    Accounts.findOne({ accountID: accountid })
        .populate('userID')
        .select("-panNumber -phoneNumber -email -netBankEnable -keys")
        .then(result => {
            console.log("get account details ", result);
            res.json({
                accountDetails: result
            })
        })
}

module.exports = { UserLogin, Register, VerifyAccount, setPassword, logout, userDetails }