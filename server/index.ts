// Load environment variables
require('dotenv').config();

// module dependencies
import { Server } from './src/server';
import winston from 'winston';
import http from 'http';
const logger: winston.Logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    new winston.transports.Console({format: winston.format.simple()})
  ]
});

// create http server
const httpPort = normalizePort(process.env.PORT || '7500');
const app = Server.bootstrap().app;

app.set('port', httpPort);
const httpServer = http.createServer(app);

// listen on provided ports
httpServer.listen(httpPort);

// add error handler
httpServer.on('error', onError);

// start listening on port
httpServer.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server 'error' event.
 */
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof httpPort === 'string' ?
    'Pipe ' + httpPort : 'Port ' + httpPort;

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    logger.log('error', bind + ' requires elevated privileges');
    process.exit(1);
    break;
  case 'EADDRINUSE':
    logger.log('error', bind + ' is already in use');
    process.exit(1);
    break;
  default:
    throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */
function onListening() {
  const addr = httpServer.address();
  const bind = typeof addr === 'string' ?
    'pipe ' + addr : 'port ' + addr.port;
  logger.log('info', 'Listening on ' + bind);
  logger.log('info', 'MongoDB on ' +
             process.env.MONGO_PORT_27017_TCP_ADDR + ':' +
             process.env.MONGO_PORT_27017_TCP_PORT);
}
