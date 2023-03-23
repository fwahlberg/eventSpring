const express = require('express');

//Middleware
const auth = require('../middleware/auth');

//Controller
const {
    createTicket,
    getAllTickets,
    getTicket,
    updateTicketDetails,
    deleteTicket
} = require("../controllers/ticket.controller");
const router = new express.Router();



//router.use(auth);
router.post('/', createTicket);
router.get('/', getAllTickets);
router.get('/:ticketId', getTicket);

router.patch('/:ticketId', updateTicketDetails);
router.delete('/:ticketId', deleteTicket);
module.exports = router;