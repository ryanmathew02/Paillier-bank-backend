const express = require('express');
const router = express.Router();

const { UserLogin, Register, VerifyAccount, setPassword, logout, userDetails } = require("../Controllers/UserController");
const { tokenHandler } = require('../middleware/authHandler');

router.route('/login').post(UserLogin);
router.route('/accountverify').post(Register);
router.route('/CodeVerify').post(VerifyAccount);
router.route('/setpassword').post(setPassword);
router.route('/logout').get(logout);
router.get('/getDetails', tokenHandler, userDetails);



module.exports = router;