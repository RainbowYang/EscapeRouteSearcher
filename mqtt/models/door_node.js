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
        this.name = `Node_${mapName}_${id}`
        this.info = utils.info(this.name)
        this.subscribeTopic = utils.makeOrderTopic(mapName, id)
        this.publishTopic = utils.makeStatusTopic(mapName, id)

        this.client = mqtt.connect(utils.getMqttAddress(), {clientId: this.name})
        this.client.on('connect', () => {
            this.client.subscribe(this.subscribeTopic)
            this.publish(0)
        })
        this.client.on('message', (topic, message) => this.info("Received", message.toString()))
    }

    publish(message) {
        this.client.publish(this.publishTopic, message.toString(),
            {qos: 1, retain: 1},
            () => this.info("Publish", message.toString()))
    }
}

module.exports = (id, mapName = "test") => new DoorNode(id, mapName)

