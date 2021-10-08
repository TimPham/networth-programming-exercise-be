'use strict';

// TODO: Remove these hardcoded values for BTC -> CAD and ETH -> CAD in the future
const BTC_CAD_RATE = 68127.91
const ETH_CAD_RATE = 4522.65

// Import server configuration
let serverConfig;
try {
    const config = require('config')
    serverConfig = config.server
} catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
        // Throw exception if the error is not MODULE_NOT_FOUND
        throw e
    } else {
        // Failed to load config.js configuration file, stop.
        terminate('Missing config.js file in project root. Terminating...', -1)
    }
}

// Import Hapi
const Hapi = require('@hapi/hapi')

// Validate configuration file
if (typeof serverConfig.hostname === 'undefined' || serverConfig.hostname.length === 0) {
    // Missing hostname
    terminate('Missing hostname in config.js file. Terminating...', -1)
} else if (typeof serverConfig.port === 'undefined' || serverConfig.port.length === 0) {
    // Missing port number
    terminate('Missing port in config.js file. Terminating...', -1)
}

// Convert port number to Number then verify
let port = Number(serverConfig.port);
if (port === Number.NaN || port < 1 || port > 65535) {
    terminate('Invalid port number in config.js file. Terminating...', -1)
}

const startHapiServer = async () => {
    const hapiServer = Hapi.server({
        port: port,
        host: serverConfig.hostname
    });

    hapiServer.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            // TODO: Retrieve live Bitcoin and Ethereum prices
            // TODO: Calculate Bitcoin and Ethereum balances
            // TODO: Calculate total balance in CAD
            return ''
        }
    });

    await hapiServer.start();
    console.log('Server started on %s', hapiServer.info.uri);
}

process.on('unhandledRejection', (err) => {
    terminate(err, 1)
});

/**
 * Prints a message to stdout then terminates.
 *
 * @param message The message to print to stdout.
 * @param code    The return code.
 */
function terminate(message, code = 0) {
    console.log(message)
    process.exit(code)
}

// Start the Hapi API server
startHapiServer()
