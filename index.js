var rabbit = require('./rabbit');
var log = require('./log');
var mongoose = require('mongoose')
    , Admin = mongoose.mongo.Admin;
var connectionString = "172.16.3.216:27017";
console.log(process.argv[2]);
rabbit.rabbitInit().then((response) => {
    rabbit.consumerInit(process.argv[2]);
    if (response) {
        /// create a connection to the DB    
        var connection = mongoose.createConnection('mongodb://' + connectionString, { useNewUrlParser: true });
        connection.once('open', () => {
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
                connection.close();
            });
        });
    }
});