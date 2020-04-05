// create a custom timestamp format for log statements
var Logger = require('simple-node-logger'); // importing node logger
// logger options
var logOptions = {
    logFilePath: 'logfile.log',
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
};
var log = Logger.createSimpleLogger(logOptions);
log.setLevel('info'); // setting default level for logging
module.exports = log;