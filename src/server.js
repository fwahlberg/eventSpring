const app = require('./app');
const logger = require('./config/logger');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const serverPort = process.env.PORT;

const server = app.listen(serverPort, () => {
    logger.info(`
      ################################################
      🚀 Server listening on port: ${serverPort} 🚀
      ################################################
  `);
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});