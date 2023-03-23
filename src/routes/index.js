const express = require('express');

const eventRoute = require("./event.route");
const userRoute = require("./user.route");
const checkoutRoute = require("./checkout.route");
const ticketRoute = require("./ticket.route");

const router = express.Router();

router.use('/users', userRoute);
router.use('/events', eventRoute);
router.use('/tickets', ticketRoute);
router.use('/checkout', checkoutRoute);

module.exports = router;