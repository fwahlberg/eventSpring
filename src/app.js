//Import node modules
const express = require("express");
const morgan = require("morgan");
const winston = require("winston");
const cors = require("cors");
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const createLocaleMiddleware = require('express-locale');

// Configs
const {
    successHandle,
    errorHandle
} = require('./config/morgan');

//Import Routers
const routes = require("./routes");

// Utils
const errorHandler = require('./utils/errorHandler');
const startPolyglot = require('./utils/start-polyglot')

//Setup express
const app = express();
app.enable('trust proxy');

// Morgan Handler
app.use(successHandle);
app.use(errorHandle);

// Set security HTTP headers
app.use(helmet());





//Set up routes
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Get the user's locale, and set a default in case there's none
app.use(
    createLocaleMiddleware({
        priority: ['accept-language', 'default'],
        default: 'en_GB'
    })
);

// Start polyglot and set the language in the req with the phrases to be used
app.use(startPolyglot);

// Data sanitization against XSS
app.use(xss());

// MongoDB data sanitization
app.use(mongoSanitize());

app.use(cors());

app.options('*', cors());

app.use(compression());

app.disable('x-powered-by');



app.use(routes);

// Error Handler
app.use(errorHandler);
//Start server
module.exports = app;
