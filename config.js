module.exports = {
    ExportDBConnectionString: "10.5.3.21:27017",
    ImportDBConnectionString: "10.5.3.67:27017",
    ExportStoreFolder: "./dump/dump_10_5_3_21_backup_from_19_4_12_00",
    RabbitConfig: {
        protocol: "amqp",
        username: "test",
        password: "test",
        hostname: "172.16.0.160"
    },
    RabbitQueueName: "supto-test",
    IsADateQuery: true,
    FromDateOfDateQuery: "2020-04-19T12:00:00.000Z"
}