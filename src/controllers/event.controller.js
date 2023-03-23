const Event = require("../models/event.model");
const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const eventService = require('../services/event.service');
const ticketService = require("../services/ticket.service");

/**
 * @desc      Create New Event Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the type, message and the event
 */
const createEvent = async (req, res) => {
    const { body, user } = req;

    // 1) Create product
    const { type, message, statusCode, event } =
        await eventService.createEvent(body, user.id);

    // 2) Check if there is an error
    if (type === 'Error') {
        return res.status(statusCode).json({
            type,
            message: req.polyglot.t(message)
        });
    }

    // 3) If everything is OK, send data
    return res.status(statusCode).json({
        type,
        message: req.polyglot.t(message),
        event
    });
};

/**
 * @desc      Get All Tickets Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.query.sort - Sort returned data
 * @property  { String } req.query.select - Select specific fields
 * @property  { Number } req.query.page - Page number
 * @property  { Number } req.query.limit - Maximum number of tickets
 * @returns   { JSON } - A JSON object representing the type, message and the products
 */
const getEvents = async (req, res) => {
    let { page, sort, limit, select } = req.query;

    // 1) Setting default params
    if (!page) req.query.page = 1;
    if (!sort) req.query.sort = '';
    if (!limit) req.query.limit = 10;
    if (!select) req.query.select = '';

    // 1) Get all tickets
    const { type, message, statusCode, events } =
        await eventService.queryEvents(req);

    // 2) Check if there is an error
    if (type === 'Error') {
        return res.status(statusCode).json({
            type,
            message: req.polyglot.t(message)
        });
    }

    // 3) If everything is OK, send data
    return res.status(statusCode).json({
        type,
        message: req.polyglot.t(message),
        events
    });
};


/**
 * @desc      Get Ticket using Iit's ID Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.ticketId - Ticket ID
 * @returns   { JSON } - A JSON object representing the type, message, and the ticket
 */
const getEvent = async (req, res) => {
    // 1) Get product using it's ID
    const { type, message, statusCode, event } =
        await eventService.queryEventById(req.params.eventId);

    // 2) Check if there is an error
    if (type === 'Error') {
        return res.status(statusCode).json({
            type,
            message: req.polyglot.t(message)
        });
    }

    // 3) If everything is OK, send data
    return res.status(statusCode).json({
        type,
        message: req.polyglot.t(message),
        event
    });
};

/**
 * @desc      Update Ticket Details Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.productId - Ticket ID
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the type, message and the product
 */
const updateEventDetails = async (req, res) => {
    // 1) Update product details using it's ID
    const { type, message, statusCode, event } =
        await eventService.updateEventDetails(
            req.params.eventId,
            req.body
        );

    // 2) Check if there is an error
    if (type === 'Error') {
        return res.status(statusCode).json({
            type,
            message: req.polyglot.t(message)
        });
    }

    // 3) If everything is OK, send ticket
    return res.status(statusCode).json({
        type,
        message: req.polyglot.t(message),
        event
    });
};

/**
 * @desc      Update Ticket Details Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.productId - Ticket ID
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the type, message and the product
 */
const addEventTicket = async (req, res) => {
    // 1) Update product details using it's ID
    const { type, message, statusCode, event } =
        await eventService.addEventTicket(
            req.params.eventId,
            req.body
        );

    // 2) Check if there is an error
    if (type === 'Error') {
        return res.status(statusCode).json({
            type,
            message: req.polyglot.t(message)
        });
    }

    // 3) If everything is OK, send ticket
    return res.status(statusCode).json({
        type,
        message: req.polyglot.t(message),
        event
    });
};

// const getEventTickets = async (req, res) => {
//
//     try {
//         const tickets = await Ticket.find({event: req.params.eventId});
//         res.status(200).send(tickets);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// };

// const addEventTicket = async (req, res) => {
//     const eventId = req.params.eventId;
//     const body = req.body;
//     try {
//         const event = await Event.findById(eventId);
//         if (!event) {
//             return res.status(404).send();
//         }
//         console.log(event.id);
//
//         const newTicket = await Ticket.create({
//             ...body,
//             event: event.id
//         });
//
//         event.tickets.push(newTicket.id);
//
//         await event.save();
//          res.send(event);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// };

// const updateEventDetails = async (req, res) => {
//     const eventId = req.params.eventId;
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ['imageUrl', 'title', 'date', 'town', 'venue', 'description', 'openTime', 'startingPrice'];
//     const isValidOperation = updates.every((update) => {
//         return allowedUpdates.includes(update);
//     });
//
//     if (!isValidOperation) {
//         return res.status(400).send({error: 'Invalid updates!'});
//     }
//
//     try {
//         const event = await Event.findById(eventId);
//         if (!event) {
//             return res.status(404).send();
//         }
//
//
//         updates.forEach(update => {
//             event[update] = req.body[update];
//         });
//
//
//
//         await event.save();
//
//
//         res.send(event);
//     } catch (e) {
//         res.status(400).send(e);
//     }
// };

// const deleteEvent = async (req, res) => {
//     const eventId = req.params.eventId;
//     try {
//         const event = await Event.findById(eventId);
//
//         if (!event) {
//             res.status(404).send({message: 'Event not found'});
//         }
//
//         event.remove();
//         res.send(event);
//     } catch (e) {
//         res.status(500).send();
//     }
// };

const deleteEvent = async (req, res) => {
    // 1) Delete product using it's ID
    const { type, message, statusCode, event } = await eventService.deleteEvent(
        req.params.eventId
    );

    // 2) Check if there is an error
    if (type === 'Error') {
        return res.status(statusCode).json({
            type,
            message: req.polyglot.t(message)
        });
    }

    // 3) If everything is OK, send data
    return res.status(statusCode).json({
        type,
        message: req.polyglot.t(message),
        event
    });
};


module.exports = {
    createEvent,
    getEvents,
    getEvent,
    addEventTicket,
    updateEventDetails,
    deleteEvent
};