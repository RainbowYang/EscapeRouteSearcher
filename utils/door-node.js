/**
 * 门锁节点。
 *
 * 每个节点应当拥有一个唯一的id。
 * 每个节点都应该（通过 "order/[id]" 的topic）订阅(subscribe)自身应指示的逃跑方向
 * 每个节点都应该（通过 "status/[id]" 的topic）发布(publish)自身周围的火灾状态，并设置qos大于等于1。
 */
const mqtt = require('mqtt')
const utils = require("./my-utils")

class DoorNode {
    constructor(id, mapName = "test") {
        this.NAME = "Node" + id
        this.info = utils.info(this.NAME)
        this.subscribeTopic = utils.makeTopic(utils.ORDER, mapName, id)
        this.publishTopic = utils.makeTopic(utils.STATUS, mapName, id)

        this.node = mqtt.connect(utils.getMqttAddress(), {clientId: this.NAME})

        this.node.on('connect', () => {
            this.node.subscribe(this.subscribeTopic)
            this.publish(0)
        })
        this.node.on('message', (topic, message) => this.info("Received", message.toString()))
    }

    publish(message) {
        this.node.publish(this.publishTopic, message.toString(), {qos: 1, retain: true},
            () => this.info("Publish", message.toString()))
    }
}

module.exports = DoorNode

