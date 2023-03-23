const express = require("express");
const router = new express.Router();

//Middleware
const auth = require('../middleware/auth');
const {addItemToCheckout} = require("../controllers/checkout.controller");

router.use(auth);

router.route('/').post(addItemToCheckout);

module.exports = router;