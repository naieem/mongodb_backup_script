const amqp = require('amqplib/callback_api');
const config = require("./config");
const DumpFile = require('./dump');
const log = require('./log');
const connectionInfo = config.RabbitConfig;
const queueName = config.RabbitQueueName;
const RabbitChannel;


module.exports = {
    rabbitInit: () => {
        return new Promise((resolve, reject) => {
            amqp.connect(connectionInfo, (error0, connection) => {
                if (error0) {
                    console.log("Error on rabbit connection ", error0);
                    resolve(false);
                }
                log.info("Rabbit connection established");
                connection.createChannel((error1, channel) => {
                    if (error1) {
                        throw error1;
                    }
                    channel.assertQueue(queueName, {
                        durable: true
                    });
                    log.info("Rabbit channel created");
                    channel.prefetch(1);
                    log.info(" [*] Waiting for messages in " + queueName);
                    RabbitChannel = channel;
                    resolve(true);
                });
            });
        });
    },
    sendToQueue: (data) => {
        if (RabbitChannel) {
            RabbitChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
                persistent: true
            });
        } else {
            log.info(" No rabbit channel found ");
        }
    },
    consumerInit: (action) => {
        log.info("Consumer initialization executed ");
        if (RabbitChannel) {
            let count = 1;
            RabbitChannel.consume(queueName, (msg) => {
                log.info(" [x] message Received,Execution number " + count);
                let msgContent = JSON.stringify(msg.content.toString());
                msgContent = JSON.parse(msgContent);
                msgContent = msgContent.trim();
                msgContent = JSON.parse(msgContent);
                log.info('================== Start =====================');
                if (action) {
                    if (action == 'export') {
                        log.info("============= Export action found for Database: " + msgContent.db + " =============");
                        DumpFile.exportDB(msgContent.connectionString, msgContent.db).then((response) => {
                            log.info('Back to response now');
                            if (response.status) {
                                log.info("Finished exporting for Database " + msgContent.db);
                                log.info('================== End =====================');
                                count = count + 1;
                                RabbitChannel.ack(msg, false);
                            } else {
                                log.info(response.message);
                            }
                        });
                    }
                    if (action == 'import') {
                        log.info("============= Import action found for Database: " + msgContent.db + " =============");
                        DumpFile.importDB(msgContent.connectionString, msgContent.db).then((response) => {
                            log.info('Back to response now');
                            if (response.status) {
                                log.info("Finished importing for Database " + msgContent.db);
                                log.info('================== End =====================');
                                count = count + 1;
                                RabbitChannel.ack(msg, false);
                            } else {
                                log.info(response.message);
                            }
                        });
                    }
                } else {
                    log.info("============= Error: Sorry Action is empty =============");
                }

            },
                {
                    noAck: false
                });
        } else {
            console.log("No rabbit channel found");
        }
    }
}