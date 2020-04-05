# Mongodb Backup script

This repo includes files that is used to take backup of mongodb data and import.

## Export

To export data, run the command 
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

### Important Notice
While exporting huge amount of Data you need to increase your buffer memory that nodejs can use maximum RAM to process huge data.

Inside dump.js adjust the variable value according to your need.Keep it as high as possible.
```
var bufferConfig = { maxBuffer: 1024 * 1024 * 2048 }; // increase ram memory size
It is 2GB now
```

### Importing Huge data
If you want to import huge/large size data,I would recommend using shell script to execute.Inside the repo you will find a shell script named 'import.sh'.That will help to import large data.

You just need to update two variables.
```
base_data_path='./216_dump_backup/*'
db_string='172.16.3.78:27017';
```
Here 'base_data_path' means where you have exported your datas.

'db_string' means the new location where you want to import data.

Thank you all this is all i have got for you.