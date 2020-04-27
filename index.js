const rabbit = require('./rabbit');
const dumpJob = require('./dump');
const config = require("./config");
var cron = require('node-cron');
const logs = require('./log');
const mongoose = require('mongoose')
    , Admin = mongoose.mongo.Admin;
const connectionString = config.ExportDBConnectionString;
// console.log(process.argv[2]);
function init() {
    global.log = logs.initialize();
    log.info('******************************************* New Execution Starts ***************************************');
    log.info('******************************************************************');
    log.info('*******************************************');
    dumpJob.setActionDate(new Date());
    rabbit.rabbitInit().then((response) => {
        if (response) {
            /// create a connection to the DB    
            let connection = mongoose.createConnection('mongodb://' + connectionString, { useNewUrlParser: true });
            connection.once('open', () => {
                // connection established
                new Admin(connection.db).listDatabases((err, result) => {
                    log.info('Total DB Found ' + result.databases.length);
                    // database list stored in result.databases
                    let allDatabases = result.databases;
                    let count = 1;
                    allDatabases.forEach(database => {
                        rabbit.sendToQueue({
                            db: database.name,
                            connectionString: connectionString
                        });
                        if (count == allDatabases.length) {
                            rabbit.consumerInit("export");
                        } else {
                            count = count + 1;
                        }
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