const rabbit = require('./rabbit');
const config = require("./config");
const log = require('./log');
const mongoose = require('mongoose')
    , Admin = mongoose.mongo.Admin;
// const connectionString = "mongodb://10.5.3.67:27017,10.5.3.239:27017,10.5.3.227:27017/?replicaSet=rs0&readPreference=primaryPreferred";
// const connectionString = "10.5.3.21:27017";
console.log(process.argv[2]);
// var connection = mongoose.createConnection(connectionString, { useNewUrlParser: true });
// connection.once('open', () => {
//     // connection established
//     console.log("connectiond");
// });
rabbit.rabbitInit().then((response) => {
    if (response) {
        /// create a connection to the DB    
        var connection = mongoose.createConnection('mongodb://' + config.ExportDBConnectionString, { useNewUrlParser: true });
        connection.once('open', () => {
            log.info("connection created");
            if (config.DBNames.length) {
                config.DBNames.forEach(database => {
                    rabbit.sendToQueue({
                        db: database,
                        connectionString: config.ExportDBConnectionString
                    });
                });
            } else {
                // connection established
                new Admin(connection.db).listDatabases((err, result) => {
                    // console.log('Total DB Found ', result.databases.length);
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
                });
            }
            connection.close();
            rabbit.consumerInit(process.argv[2]);
        });
    }
});