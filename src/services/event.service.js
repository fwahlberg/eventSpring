const Event = require('../models/event.model');
const Ticket = require("../models/ticket.model");
const ticketService = require('./ticket.service');
const apiFeatures = require("../utils/apiFeatures");

/**
 * @desc    Create new Event
 * @param   { Object } body - Body object data
 * @param   { String } organiser - Event organiser ID
 * @returns { Object<type|message|statusCode|event> }
 */
const createEvent = async (body, organiser) => {
    const {
        imageUrl,
        title,
        slug,
        date,
        town,
        venue,
        description,
        openTime,
        tickets
    } = body;


    // 1) Check if there are any empty fields
    if (
        !title ||
        !description
    ) {
        return {
            type: 'Error',
            message: 'fieldsRequired',
            statusCode: 400
        };
    }
    try {
        // 2) Create event
        const event = await Event.create({
            imageUrl,
            title,
            slug,
            date,
            town,
            venue,
            description,
            openTime,
            createdBy: organiser
        });

        if (tickets) {
            const ticketDocIds = [];

            if (!!tickets.length) {
                for (const ticket of tickets) {
                    const {
                        type,
                        message,
                        statusCode,
                        ticket: newTicket
                    } = await ticketService.createTicket({
                        ...ticket,
                        event: event.id
                    });

                    if (type === 'Error') {
                        return {
                            type,
                            message,
                            statusCode
                        };
                    }

                    ticketDocIds.push(newTicket.id);
                }
            }

            event.tickets = ticketDocIds;


        }
        await event.save();

        // 3) If everything is OK, send data
        return {
            type: 'Success',
            message: 'successfulEventCreate',
            statusCode: 201,
            event
        };

    } catch (e) {
        return {
            type: 'Error',
            message: 'serverError',
            statusCode: 500
        };
    }

};

/**
 * @desc    Query events
 * @returns { Object<type|message|statusCode|events> }
 */
const queryEvents = async (req) => {
    try {
        const events = await apiFeatures(req, Event);

        // 1) Check if tickets exist
        if (!events) {
            return {
                type: 'Error',
                message: 'noEventsFound',
                statusCode: 404
            };
        }

        // 3) If everything is OK, send data
        return {
            type: 'Success',
            message: 'successfulEventsFound',
            statusCode: 200,
            events
        };
    } catch (e) {
        return {
            type: 'Error',
            message: 'serverError',
            statusCode: 500
        };
    }


};

/**
 * @desc    Query Ticket Using it's ID
 * @param   { String } ticketId - Product ID
 * @returns { Object<type|message|statusCode|ticket> }
 */
const queryEventById = async (eventId) => {

    try {
        const event = await Event.findById(eventId).populate('tickets');


        // 1) Check if ticket exists
        if (!event) {
            return {
                type: 'Error',
                message: 'noEventFound',
                statusCode: 404
            };
        }
        // 2) If everything is OK, send ticket
        return {
            type: 'Success',
            message: 'successfulEventFound',
            statusCode: 200,
            event
        };
    } catch (e) {
        return {
            type: 'Error',
            message: 'serverError',
            statusCode: 500
        };
    }

};

/**
 * @desc    Update Ticket Details
 * @param   { Object } body - Body object data
 * @param   { String } eventId - Ticket ID
 * @returns { Object<type|message|statusCode|ticket> }
 */
const updateEventDetails =
    async (eventId, body) => {
        const updates = Object.keys(body);

        try {
            const event = await Event.findById(eventId);

            // 1) Check if the ticket exists
            if (!event) {
                return {
                    type: 'Error',
                    message: 'noEventFound',
                    statusCode: 404
                };
            }


            // 2) Check if user tries to update tickets field
            if (body.tickets) {
                return {
                    type: 'Error',
                    message: 'ticketUpdateNotPermitted',
                    statusCode: 401
                };
            }



            // 5) Update ticket

            updates.forEach(update => {
                event[update] = body[update];
            });
            await event.save();

            // 6) If everything is OK, send data
            return {
                type: 'Success',
                message: 'successfulEventUpdate',
                statusCode: 200,
                event
            };
        } catch (e) {
            return {
                type: 'Error',
                message: 'serverError',
                statusCode: 500
            };
        }

    };

/**
 * @desc    Update Ticket Details
 * @param   { Object } ticket - Body object data
 * @param   { String } eventId - Ticket ID
 * @returns { Object<type|message|statusCode|ticket> }
 */
const addEventTicket =
    async (eventId, ticket) => {

        try {
            const event = await Event.findById(eventId);
            if (!event) {
                return {
                    type: 'Error',
                    message: 'noEventFound',
                    statusCode: 404
                };
            }


            const {
                type,
                message,
                statusCode,
                ticket: newTicket
            } = await ticketService.createTicket({
                ...ticket,
                event: event.id
            });

            if (type === 'Error') {
                return {
                    type,
                    message,
                    statusCode
                };
            }

            event.tickets.push(newTicket.id);

            await event.save();
            // 6) If everything is OK, send data
            return {
                type: 'Success',
                message: 'successfulEventUpdate',
                statusCode: 200,
                event
            };
        } catch (e) {
            return {
                type: 'Error',
                message: 'serverError',
                statusCode: 500
            };
        }

    };

/**
 * @desc    Delete Ticket Using It's ID
 * @param   { String } eventId - Ticket ID
 * @returns { Object<type|message|statusCode> }
 */
const deleteEvent = async (eventId) => {
    const event = await Event.findById(eventId);

    // 1) Check if product doesn't exist
    if (!event) {
        return {
            type: 'Error',
            message: `noEventFound`,
            statusCode: 404
        };
    }



    // 3) Delete ticket using it's ID
    await event.remove();

    // 4) If everything is OK, send data
    return {
        type: 'Success',
        message: 'successfulTicketDelete',
        statusCode: 200,
        event
    };
};
module.exports = {
    createEvent,
    queryEvents,
    queryEventById,
    updateEventDetails,
    addEventTicket,
    deleteEvent
};