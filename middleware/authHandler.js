const jwt = require("jsonwebtoken");
const { ErrorHandler } = require("../utils/ErrorHandler");


module.exports.tokenHandler = (req, res, next) => {
    console.log("qwertyuiop", req.cookies)
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT, (err, decoded) => {
            if (err) {
                res.statusCode = 400;
                console.log("eror auth");
                res.clearCookie("jwt");
                res.json({ status: 400, message: "Expired token" })

            } else {
                console.log("coorect auth");
                req.decoded = decoded
                next()
            }
        })
    } else {
        console.log("no token");
        res.json({ status: 400, message: "No Token" })
    }

}

