const fs = require("fs").promises;
const https = require("https");

const loadLocalFile = async (filename) => {
    const contents = await fs.readFile(filename)
    return JSON.parse(contents)
}

const loadRemoteFeed = async (url) => {
    return https.get(url, (resource) => {
        let buffer = '';

        // Read data stream and add data to the buffer
        resource.on('data', (data) => {
            // Add to buffer
            buffer += data
        })

        // Once finished, return JSON
        resource.on('end', () => {
            return JSON.parse(buffer)
        })
    }).on('error', (error) => {
        return {}
    })
}

const process = async (data) => {
    // TODO: Calculate fiat + crypto balances
    return {
        current_balance_cad: 0,
        current_balance_btc: 0,
        current_balance_eth: 0,
        number_transactions: data.length,
        transaction_data: {},
    }
}

/**
 * Process local transaction history file.
 *
 * @param filepath
 *
 * @returns {{current_balance_cad: number, current_balance_btc: number, data, current_balance_eth: number}}
 */
const processLocalFile = async (filepath) => {
    const feedData = await loadLocalFile(filepath)
    return process(feedData)
}

const processRemoteFeed = async (url) => {
    const feedData = await loadRemoteFeed(url)
    return process(feedData)
}

// Export Server configuration
module.exports = {
    processLocal: processLocalFile,
    processRemoteFeed: processRemoteFeed,
};