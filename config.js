module.exports = {
    ExportDBConnectionString: "172.16.0.13:27017",
    ImportDBConnectionString: "172.16.3.78:27017",
    ExportStoreFolder: "./dump/dump_13_backup",
    RabbitConfig: {
        protocol: "amqp",
        username: "test",
        password: "test",
        hostname: "172.16.0.160"
    },
    RabbitQueueName: "supto-test",
    IsADateQuery: false,
    FromDateOfDateQuery: "2020-02-10T00:00:00.000Z"
}