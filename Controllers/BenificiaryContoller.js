const { Benif } = require("../models/Benificiary");
const { Key } = require("../models/Keys");
const { User } = require("../models/User");


const addBenificiary = async (req, res) => {
    console.log("Running add benif api");
    const accountNumber = req.body.accountNumber;
    const reqUser = req.decoded;

    User.findOne({ accountNumber })
        .populate('keys')
        .then(result => {
            console.log("Benif details ", result);
            const newBenif = {
                userID: {
                    accountID: result.accountID,
                    Name: result.firstName + " " + result.lastName,
                    branch: "XYZ",
                    IFSC: "XX2593"
                },
                publicKey: {
                    n: result.keys.publicKey.n,
                    g: result.keys.publicKey.g,
                    r: result.keys.publicKey.r
                }
            }
            Benif.findOneAndUpdate({ accountID: reqUser.accountID }, { $push: { list: newBenif } })
                .then(result => {
                    console.log("Succussfully added new user");
                    res.status(200).json(
                        { message: "Succussfully added new user" }
                    )
                })
        }).catch(err => {
            console.log("No Such Account, Please Check");
            res.status(400).json({
                message: "No Such Account, Please Check"
            })
        })
}

const getBenificiary = async (req, res) => {
    const user = req.decoded;

    Benif.findOne({ accountID: user.accountID })
        .select("list")
        .then(result => {
            console.log("Benificiaries ", result);
            res.status(200).json({
                list: result
            })
        })
        .catch(err => {
            console.log("Error in Finding user's benificiary", err);
            res.status(400).json({
                message: "Error in Finding user's benificiary"
            })
        })
}

module.exports = { addBenificiary, getBenificiary }