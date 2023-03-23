const mongoose = require('mongoose');

const checkoutSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            match: [
                /[\w]+?@[\w]+?\.[a-z]{2,4}/,
                'The value of path {PATH} ({VALUE}) is not a valid email address.'
            ]
        },
        items: [
            {
                ticket: {
                    type: mongoose.Types.ObjectId,
                    ref: 'Ticket',
                    required: true
                },
                totalTicketQuantity: {
                    type: Number,
                    required: true
                },
                totalTicketPrice: {
                    type: Number,
                }
            }
        ],
        totalPrice: {
            type: Number,
        },
        totalQuantity: {
            type: Number,
        }
    },
    { timestamps: true }
);



checkoutSchema.pre('save', function (next) {
    this.populate([
        {
            path: 'items.event',
            select: 'event'
        },
        {
            path: 'items.ticket'
        }
    ]);

    next();
});



const Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;