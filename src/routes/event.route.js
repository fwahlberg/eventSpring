const express = require("express");
const router = new express.Router();
const {createEvent, getEvents, getEvent,
    addEventTicket, updateEventDetails,
    deleteEvent,
    getEventTickets
} = require("../controllers/event.controller");
const auth = require("../middleware/auth");

    router
    .get('/', getEvents);

    router.get('/:eventId', getEvent)
    // router.get('/:eventId/tickets', getEventTickets)

    router.use(auth);

    router.route("/")
        .post(createEvent)

    router.route('/ticket/:eventId').post(addEventTicket)

    router.patch('/:eventId', updateEventDetails)

    router.delete('/:eventId', deleteEvent)

module.exports = router;