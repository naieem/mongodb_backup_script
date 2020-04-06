# Mongodb Backup script

This repo includes files that is used to take backup of mongodb data and import.

## Configuration
At the beginning you have to configure a config file which contains all the necessary configuration needed to run the script.Let's see how the configuration states.

```
{
    ExportDBConnectionString: "172.16.0.13:27017", // from which to export
    ImportDBConnectionString: "172.16.3.78:27017", // to which to import
    ExportStoreFolder: "./dump/dump_13_backup", // where to store all files
    RabbitConfig: {
        protocol: "amqp",
        username: "test",
        password: "test",
        hostname: "172.16.0.160"
    },
    RabbitQueueName: "supto-test", // rabbit queue name
    IsADateQuery: false, // do you want to export from specific date?
    FromDateOfDateQuery: "2020-02-10T00:00:00.000Z" // write the date in this format to export from that date.
}
NB: Please keep in mind, To export from specific date 'IsADateQuery' configuration must be true and also 'FromDateOfDateQuery' can never be null or undefined;

```

## Export

To export data, run the command 
```
npm run export
```
Actually back of this command we will execute,

```
node index export
```

Here the 3rd argument 'export' will be in action to execute export functionality.

NB.If you are not importing huge amount of data then use below configuration.
### import

To import data, run the command 
```
node index import
```
Here the 3rd argument 'import' will be in action to execute import functionality.

### Date filter Exportation

If you want to export data from an specific date then you have to change some variables,

Inside the dump.js
```
fromDate:2020-02-10T00:00:00.000Z
dateRangeChecker: true ; // false means you dont want to export from date checking.It will return all the values
```
Otherwise all the datas will be exported

### Importing Huge data
If you want to import huge/large size data,I would recommend using shell script to execute.Inside the repo you will find a shell script named 'import.sh'.That will help to import large data.

You just need to update two variables.
```
base_data_path='./216_dump_backup/*'
db_string='172.16.3.78:27017';
```
Here 'base_data_path' means where you have exported your datas.

'db_string' means the new location where you want to import data.


### Important Notice
While exporting huge amount of Data you need to increase your buffer memory that nodejs can use maximum RAM to process huge data.

Inside dump.js adjust the variable value according to your need.Keep it as high as possible.
```
var bufferConfig = { maxBuffer: 1024 * 1024 * 2048 }; // increase ram memory size
It is 2GB now
```

Also this script is using rabbitmq for better performance. So you have to put two new configuration here.

```
var connectionInfo = {
    protocol: "amqp",
    username: "test",
    password: "test",
    hostname: "172.16.0.160"
};
var queueName = "supto-test";
```
Put your own configuration there and bingo start using this.


Thank you all this is all i have got for you.