// Server configuration
const server = {
    'hostname': 'localhost',
    'port': 8000,
    'environment': 'dev',
    'transactionFeedURL': 'https://shakepay.github.io/programming-exercise/web/transaction_history.json',
    'transactionLocalPath': 'tests/files/transaction_history.json',
};

// Export Server configuration
module.exports = {
    server: server,
};