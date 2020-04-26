// create a custom timestamp format for log statements
var Logger = require('simple-node-logger'); // importing node logger
// logger options
var logDate = new Date();
var logtime='_'+logDate.getDate()+'_'+(logDate.getMonth()+1)+'_'+logDate.getHours()+'_'+logDate.getMinutes();
var logOptions = {
    logFilePath: 'logfile'+logtime+'.log',
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
};
var log = Logger.createSimpleLogger(logOptions);
log.setLevel('info'); // setting default level for logging
module.exports = log;