/**
 * 它订阅所有节点的status，然后使用[data-processor.js]处理数据，并负责发布所有节点的order
 */
const mqtt = require('mqtt')
const port = require("../config.json").mqtt.port

module.exports = function () {
    const processor = require("./data-processor")(require("../data.json"))
    const client = mqtt.connect('mqtt://localhost:' + port, {
        clientId: "mqtt-data_client"
    })


    client.on('connect', function () {
        client.subscribe("status/+")
    })

    client.on('message', function (topic, message) {
        console.log(message.toString(), "Received By data_processor")
        let id = topic.split("status/")[1]
        processor.updateStatus(id, message)
        client.publish("order/" + id, processor.getOrder(id))
    })

    return client
}
