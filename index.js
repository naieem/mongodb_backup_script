const rabbit = require('./rabbit');
const dumpJob = require('./dump');
const config = require("./config");
var cron = require('node-cron');
const log = require('./log');
const mongoose = require('mongoose')
    , Admin = mongoose.mongo.Admin;
const connectionString = config.ExportDBConnectionString;
// console.log(process.argv[2]);
function init() {
    log.info('******************************************* New Execution Starts ***************************************');
    log.info('******************************************************************');
    log.info('*******************************************');
    dumpJob.setActionDate(new Date());
    rabbit.rabbitInit().then((response) => {
        rabbit.consumerInit("export");
        if (response) {
            /// create a connection to the DB    
            var connection = mongoose.createConnection('mongodb://' + connectionString, { useNewUrlParser: true });
            connection.once('open', () => {
                // connection established
                new Admin(connection.db).listDatabases((err, result) => {
                    log.info('Total DB Found ' + result.databases.length);
                    // database list stored in result.databases
                    var allDatabases = result.databases;
                    allDatabases.forEach(database => {
                        // console.log(database.name);
                        rabbit.sendToQueue({
                            db: database.name,
                            connectionString: connectionString
                        });
                    });
                    connection.close();
                });
            });
        }
    });
}

cron.schedule('0 1 * * *', () => {
    init();
});