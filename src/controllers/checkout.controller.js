const Event = require("../models/event.model");
const Checkout = require("../models/checkout.model");
const addItemToCheckout = async (req, res) => {
    const {
        ticketId,
        quantity
    } = req.body;

    if (!ticketId) {
        throw new Error('Need ticket');
    }

    const checkoutData = {
        email: req.user.email,
        items: [{
            ticket: ticketId,
            totalTicketQuantity: quantity
        }
        ],
        totalQuantity: quantity
    };
    try {
        const checkout = await Checkout.create(checkoutData);

        res.status(201).send(checkout);
    } catch (e) {
        res.status(400).send(e);
    }
};

module.exports = {
    addItemToCheckout
};