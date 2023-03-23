const Ticket = require('../models/ticket.model');
const Event = require('../models/event.model');
const apiFeatures= require('../utils/apiFeatures');


/**
 * @desc    Create new ticket
 * @param   { Object } body - Body object data
 * @returns { Object<type|message|statusCode|ticket> }
 */
const createTicket = async (body) => {
    const {
        name,
        event,
        price,
        description,
        quantity,
        sold,
        isSoldOut
    } = body;


    // 1) Check if there any empty field
    if (
        !name ||
        !description ||
        !event ||
        !quantity
    ) {
        return {
            type: 'Error',
            message: 'fieldsRequired',
            statusCode: 400
        };
    }
    try{
        // 4) Create ticket
        let ticket = await Ticket.create({
            name,
            event,
            price,
            description,
            quantity,
            sold,
            isSoldOut
        });

        await ticket.save();

        // 8) If everything is OK, send data
        return {
            type: 'Success',
            message: 'successfulTicketCreate',
            statusCode: 201,
            ticket
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
 * @desc    Query tickets
 * @returns { Object<type|message|statusCode|tickets> }
 */
const queryTickets = async (req) => {
    try {
        const tickets = await apiFeatures(req, Ticket);

        // 1) Check if tickets exist
        if (!tickets) {
            return {
                type: 'Error',
                message: 'noTicketsFound',
                statusCode: 404
            };
        }

        // 3) If everything is OK, send data
        return {
            type: 'Success',
            message: 'successfulTicketsFound',
            statusCode: 200,
            tickets
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
const queryTicketById = async (ticketId) => {

    try {
        const ticket = await Ticket.findById(ticketId);

        // 1) Check if ticket exists
        if (!ticket) {
            return {
                type: 'Error',
                message: 'noProductFound',
                statusCode: 404
            };
        }

        // 2) If everything is OK, send ticket
        return {
            type: 'Success',
            message: 'successfulTicketFound',
            statusCode: 200,
            ticket
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
 * @param   { String } ticketId - Ticket ID
 * @returns { Object<type|message|statusCode|ticket> }
 */
const updateTicketDetails =
    async (ticketId, body) => {
        const updates = Object.keys(body);

        try {
            const ticket = await Ticket.findById(ticketId);

            // 1) Check if the ticket exists
            if (!ticket) {
                return {
                    type: 'Error',
                    message: 'noTicketFound',
                    statusCode: 404
                };
            }


            // 2) Check if user tries to update sold field
            if (body.sold) {
                return {
                    type: 'Error',
                    message: 'salesUpdateNotPermitted',
                    statusCode: 401
                };
            }

            // 3) Check the user does not attempt to decrease quantity below sales
            if (body.quantity < ticket.sold) {
                return {
                    type: 'Error',
                    message: 'quantityLessThanSales',
                    statusCode: 401
                };
            }


            // 4) Update soldOut Status
            if (ticket.sold >= body.quantity) {
                body.isSoldOut = true;
            } else if (ticket.sold < body.quantity) {
                body.isSoldOut = false;
            }

            // 5) Update ticket

            updates.forEach(update => {
                ticket[update] = body[update];
            });
            await ticket.save();

            // 6) If everything is OK, send data
            return {
                type: 'Success',
                message: 'successfulTicketUpdate',
                statusCode: 200,
                ticket
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
 * @param   { String } ticketId - Ticket ID
 * @returns { Object<type|message|statusCode> }
 */
const deleteTicket = async (ticketId) => {
    const ticket = await Ticket.findById(ticketId);

    // 1) Check if product doesn't exist
    if (!ticket) {
        return {
            type: 'Error',
            message: `noTicketFound`,
            statusCode: 404
        };
    }

    const eventId = ticket.event;

    const event = await Event.updateOne({_id: eventId}, {$pull: {tickets: ticketId}});

    console.log(event);

    // 3) Delete ticket using it's ID
    await ticket.remove();

    // 4) If everything is OK, send data
    return {
        type: 'Success',
        message: 'successfulTicketDelete',
        statusCode: 200,
        ticket
    };
};


module.exports = {
    createTicket,
    queryTickets,
    queryTicketById,
    updateTicketDetails,
    deleteTicket
};