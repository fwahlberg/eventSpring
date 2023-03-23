const Ticket = require("../models/ticket.model");
const Event = require("../models/event.model");

const ticketService = require('../services/ticket.service');

/**
 * @desc      Create New Ticket Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the type, message and the product
 */
const createTicket = async (req, res) => {
    const { body} = req;

    // 1) Create product
    const { type, message, statusCode, ticket } =
        await ticketService.createTicket(body);

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
        ticket
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
const getAllTickets = async (req, res) => {
    let { page, sort, limit, select } = req.query;

    // 1) Setting default params
    if (!page) req.query.page = 1;
    if (!sort) req.query.sort = '';
    if (!limit) req.query.limit = 10;
    if (!select) req.query.select = '';

    // 1) Get all tickets
    const { type, message, statusCode, tickets } =
        await ticketService.queryTickets(req);

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
        tickets
    });
};


/**
 * @desc      Get Ticket using Iit's ID Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.ticketId - Ticket ID
 * @returns   { JSON } - A JSON object representing the type, message, and the ticket
 */
const getTicket = async (req, res) => {
    // 1) Get product using it's ID
    const { type, message, statusCode, ticket } =
        await ticketService.queryTicketById(req.params.ticketId);

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
        ticket
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
const updateTicketDetails = async (req, res) => {
    // 1) Update product details using it's ID
    const { type, message, statusCode, ticket } =
        await ticketService.updateTicketDetails(
            req.params.ticketId,
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
        ticket
    });
};

/**
 * @desc      Delete Ticket Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.ticketId - Product ID
 * @return    { JSON } - A JSON object representing the type and message
 */
 const deleteTicket = async (req, res) => {
    // 1) Delete product using it's ID
    const { type, message, statusCode, ticket } = await ticketService.deleteTicket(
        req.params.ticketId
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
        ticket
    });
};
// const getTicket = async (req, res) => {
//     const ticketId = req.params.ticketId;
//     console.log(ticketId);
//     try {
//         const ticket = await Ticket.findById(ticketId).populate('event');
//         if (!ticket) {
//             return res.status(404).send();
//         }
//         res.send(ticket);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// };

// const updateTicketDetails = async (req, res) => {
//     const ticketId = req.params.ticketId;
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ['name', 'description', 'price', 'quantity'];
//     const isValidOperation = updates.every((update) => {
//         return allowedUpdates.includes(update);
//     });
//
//     if (!isValidOperation) {
//         return res.status(400).send({error: 'Invalid updates!'});
//     }
//
//     try {
//         const ticket = await Ticket.findById(ticketId);
//         if (!ticket) {
//             return res.status(404).send();
//         }
//
//         if(req.body.quantity < ticket.sold){
//             return res.status(400).send({error: "Quantity is less than sold tickets"})
//         }
//
//
//
//         updates.forEach(update => {
//             ticket[update] = req.body[update];
//         });
//
//         if(ticket.sold >= req.body.quantity) {
//             ticket.isSoldOut = true;
//         } else if(ticket.sold < req.body.quantity){
//             ticket.isSoldOut = false;
//         }
//
//         await ticket.save();
//
//
//         res.send(ticket);
//     } catch (e) {
//         res.status(400).send(e);
//     }
// };

module.exports = {
    createTicket,
    getAllTickets,
    getTicket,
    updateTicketDetails,
    deleteTicket
};