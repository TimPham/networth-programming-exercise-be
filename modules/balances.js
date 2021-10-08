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
    // Keep track of all of the balances
    let balances = {
        current_balance_cad: 0,
        current_balance_btc: 0,
        current_balance_eth: 0,
    }

    // Check if there are records to process
    if (data.length > 0) {
        // TODO: Calculate historical balance over time
        await data.forEach((record) => {
            if (typeof record.type !== 'undefined' && typeof record.currency !== 'undefined') {
                switch (record.type) {
                    case 'debit':
                        // Withdrawal
                        if (record.amount > 0) {
                            switch (record.currency) {
                                case 'CAD':
                                    balances.current_balance_cad -= record.amount
                                    break;
                                case 'BTC':
                                    balances.current_balance_btc -= record.amount
                                    break;
                                case 'ETH':
                                    balances.current_balance_eth -= record.amount
                                    break;
                            }
                        }
                        break;
                    case 'credit':
                        // Deposit
                        if (record.amount > 0) {
                            switch (record.currency) {
                                case 'CAD':
                                    balances.current_balance_cad += record.amount
                                    break;
                                case 'BTC':
                                    balances.current_balance_btc += record.amount
                                    break;
                                case 'ETH':
                                    balances.current_balance_eth += record.amount
                                    break;
                            }
                        }
                        break;
                    case 'conversion':
                        if (typeof record.from !== 'undefined' && typeof record.to !== 'undefined') {
                            if (typeof record.from.currency !== 'undefined' && typeof record.to.currency !== 'undefined') {
                                // Adjust from
                                switch (record.from.currency) {
                                    case 'CAD':
                                        balances.current_balance_cad -= record.from.amount
                                        break;
                                    case 'BTC':
                                        balances.current_balance_btc -= record.from.amount
                                        break;
                                    case 'ETH':
                                        balances.current_balance_eth -= record.from.amount
                                        break;
                                }

                                // Adjust to
                                switch (record.to.currency) {
                                    case 'CAD':
                                        balances.current_balance_cad += record.to.amount
                                        break;
                                    case 'BTC':
                                        balances.current_balance_btc += record.to.amount
                                        break;
                                    case 'ETH':
                                        balances.current_balance_eth += record.to.amount
                                        break;
                                }
                            }
                        }
                        break;
                }
            }
        })
    }

    // TODO: Calculate fiat + crypto balances
    return Object.assign(
        balances,
        {
            number_transactions: data.length,
            transaction_data: {},
        }
    )
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
    return await process(feedData)
}

const processRemoteFeed = async (url) => {
    const feedData = await loadRemoteFeed(url)
    return await process(feedData)
}

// Export Server configuration
module.exports = {
    processLocal: processLocalFile,
    processRemoteFeed: processRemoteFeed,
};