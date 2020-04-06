const mongoose = require("mongoose");
const { exec } = require('child_process');
const log = require('./log');
const config = require("./config");

// date checking config start
const fromDate = config.FromDateOfDateQuery; // ex: 2020-02-10T00:00:00.000Z
// var toDate = "2020-03-25T00:00:00.000Z"; // ex: 2020-02-10T00:00:00.000Z"
const dateRangeChecker = config.IsADateQuery;
// date checking config ends

const presentDate = new Date();
// format:_year_month_date_hour_minute
const dateOfActions = "_" + presentDate.getFullYear() + "_" + (presentDate.getMonth()+1) + "_" + presentDate.getDate() + "_" + presentDate.getHours() + "_" + presentDate.getMinutes();

const outputFolder = config.ExportStoreFolder + dateOfActions; // output(export) and input (import) dir
const bufferConfig = { maxBuffer: 1024 * 1024 * 2048 }; // increase ram memory size 2gb
const storeDbConnectionString = config.ImportDBConnectionString; // needed for import

function dumpDB(connectionString, db) {
  return new Promise((resolve) => {
    var connection = mongoose.createConnection(`mongodb://${connectionString}/${db}`, { useNewUrlParser: true });
    connection.once('open', (ref) => {
      console.log('Connected to mongo server.');
      //trying to get collection names
      connection.db.listCollections().toArray((err, CollectionInfo) => {
        log.info('Total Collection Found ' + CollectionInfo.length + ' for Database ' + db);
        if (CollectionInfo.length) {
          let counter = 1;
          CollectionInfo.forEach((collections) => {
            var collection = collections.name;
            var command = "";
            if (!dateRangeChecker || !fromDate || !toDate) {
              command = 'mongodump --host="' + connectionString + '" --db="' + db + '" --collection="' + collection + '" --out="' + outputFolder + '"';
            } else {
              command = 'mongodump --host="' + connectionString + '" --db="' + db + '" --collection="' + collection + '" --out="' + outputFolder + '" --query "{\\"LastUpdateDate\\":{\\"$gte\\": {\\"$date\\":\\"' + fromDate + '\\"},\\"$lte\\":{\\"$date\\":\\"' + toDate + '\\"}}}"';
            }
            exec(command, (err, stdout, stderr) => {
              log.info(counter + ' of ' + CollectionInfo.length + ' is running.Collection: ', collection, ' DB: ', db);
              if (err) {
                console.log(err);
                resolve({
                  status: false,
                  message: err
                });
              }

              // the *entire* stdout and stderr (buffered)
              // console.log(`stdout: ${stdout}`);
              // console.log(`stderr: ${stderr}`);
              log.info('Execution Result: ' + JSON.stringify(stderr));
              log.info('Finished dumping for ' + collection + ' DB: ' + db);
              if (counter == CollectionInfo.length) {
                log.info('Finished dump');
                connection.close();
                resolve({
                  status: true,
                  message: "Finished dump"
                });
              } else {
                counter = counter + 1;
                console.log(counter);
              }
            });
          });
        } else {
          log.info('No collectionInfo found');
          mongoose.connection.close();
          resolve({
            status: false,
            message: "No collectionInfo found"
          });
        }
      });
    });
  });
}

function exportDB(connectionString, db) {
  return new Promise((resolve) => {
    var connection = mongoose.createConnection(`mongodb://${connectionString}/${db}`, { useNewUrlParser: true });
    connection.once('open', (ref) => {
      console.log('Connected to mongo server.');
      //trying to get collection names
      connection.db.listCollections().toArray((err, CollectionInfo) => {
        log.info('Total Collection Found ' + CollectionInfo.length + ' for Database ' + db);
        if (CollectionInfo.length) {
          let counter = 1;
          CollectionInfo.forEach((collections) => {
            var collection = collections.name;
            var command = "";
            if (!dateRangeChecker || !fromDate) {
              command = 'mongoexport --host="' + connectionString + '" --db="' + db + '" --collection="' + collection + '" --out="' + outputFolder + '/' + db + '/' + collection + '.json" --pretty';
            } else {
              // command = 'mongoexport --host="' + connectionString + '" --db="' + db + '" --collection="' + collection + '" --out="' + outputFolder + '/' + collection + '.json" --pretty --query "{\\"LastUpdateDate\\":{\\"$gte\\": {\\"$date\\":\\"' + fromDate + '\\"},\\"$lte\\":{\\"$date\\":\\"' + toDate + '\\"}}}"';
              command = 'mongoexport --host="' + connectionString + '" --db="' + db + '" --collection="' + collection + '" --out="' + outputFolder + '/' + db + '/' + collection + '.json" --pretty --query "{\\"$or\\":[{\\"LastUpdateDate\\":{\\"$gte\\":{\\"$date\\":\\"' + fromDate + '\\"}}},{\\"CreateDate\\":{\\"$gte\\":{\\"$date\\":\\"' + fromDate + '\\"}}}]}"';
            }
            exec(command, bufferConfig, (err, stdout, stderr) => {
              // console.log(counter + ' of ' + CollectionInfo.length + ' is running.Collection: ', collection, ' DB: ', db);
              log.info(counter + ' of ' + CollectionInfo.length + ' is running.Collection: ', collection, ' DB: ', db);
              if (err) {
                console.log(err);
                resolve({
                  status: false,
                  message: err
                });
              }

              // the *entire* stdout and stderr (buffered)
              // console.log(`stdout: ${stdout}`);
              // console.log(`stderr: ${stderr}`);
              log.info('Execution Result: ' + JSON.stringify(stderr));
              log.info('Finished exporting for ' + collection + ' DB: ' + db);
              if (counter == CollectionInfo.length) {
                connection.close();
                resolve({
                  status: true,
                  message: "Finished exporting"
                });
              } else {
                counter = counter + 1;
                log.info(counter);
              }
            });
          });
        } else {
          log.info('No collectionInfo found');
          connection.close();
          resolve({
            status: false,
            message: "No collectionInfo found"
          });
        }
      });
    });
  });
}

function importDB(connectionString, db) {
  return new Promise((resolve) => {
    var connection = mongoose.createConnection(`mongodb://${connectionString}/${db}`, { useNewUrlParser: true });
    connection.once('open', (ref) => {
      console.log('Connected to mongo server.');
      //trying to get collection names
      connection.db.listCollections().toArray((err, CollectionInfo) => {
        log.info('Total Collection Found ' + CollectionInfo.length + ' for Database ' + db);
        if (CollectionInfo.length) {
          let counter = 1;
          CollectionInfo.forEach((collections) => {
            var collection = collections.name;
            var command = 'mongoimport --host="' + storeDbConnectionString + '" --db="' + db + '" --collection="' + collection + '" --file="' + outputFolder + '/' + db + '/' + collection + '.json" --mode=upsert';
            exec(command, bufferConfig, (err, stdout, stderr) => {
              log.info(counter + ' of ' + CollectionInfo.length + ' is running.Collection: ', collection, ' DB: ', db);
              if (err) {
                console.log(err);
                resolve({
                  status: false,
                  message: err
                });
              }

              // the *entire* stdout and stderr (buffered)
              // console.log(`stdout: ${stdout}`);
              // console.log(`stderr: ${stderr}`);
              log.info('Execution Result: ' + JSON.stringify(stderr));
              log.info('Finished importing for ' + collection + ' DB: ' + db);
              if (counter == CollectionInfo.length) {
                log.info('Finished importing');
                connection.close();
                resolve({
                  status: true,
                  message: "Finished importing"
                });
              } else {
                counter = counter + 1;
                console.log(counter);
              }
            });
          });
        } else {
          log.info('No collectionInfo found');
          mongoose.connection.close();
          resolve({
            status: false,
            message: "No collectionInfo found"
          });
        }
      });
    });
  });
}

module.exports = {
  dumpDB: dumpDB,
  exportDB: exportDB,
  importDB: importDB
}
