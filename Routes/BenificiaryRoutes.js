const express = require('express');
const router = express.Router();
const { tokenHandler } = require('../middleware/authHandler');
const { addBenificiary, getBenificiary } = require('../Controllers/BenificiaryContoller');


router.post('/addBenificiary', tokenHandler, addBenificiary);
router.get('/getBenificiary', tokenHandler, getBenificiary);

module.exports = router;
