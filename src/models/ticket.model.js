
const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");
const Event = require("./event.model");


const ticketSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    name: {
        type: String,
        required: [true, 'A ticket must have a name'],
        trim: true
    },
    slug: String,
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    isSoldOut: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


ticketSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});
const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;

