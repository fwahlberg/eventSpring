const Polyglot = require('node-polyglot');
const { messages } = require('../config/i18n');

const startPolyglot = (req, res, next) => {
    // Get the locale from express-locale
    const locale = req.locale.language;

    // Start Polyglot and add it to the req
    req.polyglot = new Polyglot();

    // Decide which phrases for polyglot will be used

    req.polyglot.extend(messages.en);


    next();
};

module.exports = startPolyglot;