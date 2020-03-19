/**
 * 门锁节点。
 *
 * 每个节点应当拥有一个唯一的id。
 * 每个节点都应该（通过 "order/[id]" 的topic）订阅(subscribe)自身应指示的逃跑方向
 * 每个节点都应该（通过 "status/[id]" 的topic）发布(publish)自身周围的火灾状态，并设置qos大于等于1。
 */
const mqtt = require('mqtt')
const utils = require("../utils")

class DoorNode {
    constructor(id, mapName) {
        this.name = `Node(${mapName}/${id})`
        this.info = utils.info(this.name)
        this.subscribeTopic = utils.orderTopic(mapName, id)
        this.publishTopic = utils.statusTopic(mapName, id)

        this.client = mqtt.connect(utils.mqtt_url(), {clientId: this.name})
        this.client.subscribe(this.subscribeTopic)
        this.client.on('message',
            (topic, message) => this.info("Received", message.toString()))
    }

    publish(message) {
        this.client.publish(this.publishTopic, message.toString(),
            {qos: 1, retain: true},
            // () => this.info("Publish", message.toString())
        )
        return this
    }
}

module.exports = (id, mapName = "test") => new DoorNode(id, mapName)

