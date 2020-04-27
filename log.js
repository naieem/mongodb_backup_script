// create a custom timestamp format for log statements
var Logger = require('simple-node-logger'); // importing node logger

function initialize() {
    var logDate = new Date();
    var logFileName = "_" + logDate.getDate() + "_" + (logDate.getMonth() + 1) + "_" + logDate.getHours() + "_" + logDate.getMinutes();
    // logger options
    var logOptions = {
        logFilePath: 'logfile' + logFileName + '.log',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
    };
    var log = Logger.createSimpleLogger(logOptions);
    log.setLevel('info'); // setting default level for logging
    return log;
}
module.exports = {
    initialize: initialize
}