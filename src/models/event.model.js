const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require('slugify');
const Ticket = require('./ticket.model');

const eventSchema = new mongoose.Schema({
    imageUrl: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    slug: String,
    date: {
        type: Date
    },
    town: {
        type: String
    },
    venue: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tickets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        }
    ],
    openTime: {
        type: Date
    },
    startingPrice: Number,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

eventSchema.pre('remove', async function (next) {
    await Ticket.deleteMany({event: this._id});
    next();
});
eventSchema.pre('save', function (next) {
    this.slug = slugify(this.title, {lower: true});
    this.populate('tickets');
    next();
});


const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
