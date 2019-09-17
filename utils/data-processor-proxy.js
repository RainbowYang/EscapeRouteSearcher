/**
 * 为[data-processor.js]代理与mqtt之间的通信交流
 */
const mqtt = require('mqtt')

const config = require("../config.json")
const info = require("./my-utils").info
const DataProcessor = require("./data-processor.js")

const name = "DataProcessor"
module.exports = {
    start(data) {
        const processor = new DataProcessor(data)
        const proxy = mqtt.connect(`mqtt://${config.mqtt.ip}:${config.mqtt.port}`, {clientId: "mqtt-data-processor"})
        proxy.on('connect', () =>
            data.nodes.forEach(node =>
                proxy.subscribe(`status/${node.id}`, {qos: 1},
                    () => info(name, "Subscribed", `status/${node.id}`))
            )
        )
        proxy.on('message', (topic, payload) => {
            info(name, "Received", payload.toString(), "Under", topic)
            let id = topic.split("status/")[1]
            let order = processor.updateStatusAndGetOrder(id, payload)
            proxy.publish(`order/${id}`, order, () => info(name, "Publish", order, "Under", `order/${id}`))
        })
    }
}