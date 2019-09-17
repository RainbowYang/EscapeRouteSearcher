/**
 * 门锁节点。
 *
 * 每个节点应当拥有一个唯一的id。
 * 每个节点都应该（通过 "order/[id]" 的topic）订阅(subscribe)自身应指示的逃跑方向
 * 每个节点都应该（通过 "status/[id]" 的topic）发布(publish)自身周围的火灾状态，并设置qos大于等于1。
 */
const mqtt = require('mqtt')

const config = require("../config.json")
const info = require("./my-utils").info

module.exports = function (
    id = Math.random().toString(16).substr(2, 8)  // 门锁节点的id，应当唯一
) {
    const node = mqtt.connect(`mqtt://${config.mqtt.ip}:${config.mqtt.port}`, {clientId: 'mqtt_node_' + id,})
    node.on('connect', () => {
        node.subscribe('order/' + id)
        node.publish('status/' + id, "Hello, I'm " + id, {qos: 1, retain: true})
    })
    node.on('message', (topic, message) => {
        info('mqtt_node_' + id, message.toString(), "Received")
    })
    return node
}

