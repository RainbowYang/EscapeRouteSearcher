/**
 * 门锁节点。
 *
 * 每个节点应当拥有一个唯一的id。
 * 每个节点都应该（通过 "order/[id]" 的topic）订阅(subscribe)自身应指示的逃跑方向
 * 每个节点都应该（通过 "status/[id]" 的topic）发布(publish)自身周围的火灾状态，并设置qos大于等于1。
 */
const mqtt = require('mqtt')

const port = require("../config.json").mqtt.port
module.exports = function (
    // 门锁节点的id，应当唯一
    id = Math.random().toString(16).substr(2, 8)
) {
    const node = mqtt.connect('mqtt://localhost:' + port, {
        clientId: "mqtt_node_" + id,
    })

    node.on('connect', function () {
        node.publish('status/' + id, 'Hello mqtt, this is ' + id, {
            qos: 1
        })
        node.subscribe('order/' + id, err => {
            if (err) {
                console.error(err)
            }
        })
    })
    node.on('message', function (topic, message) {
        console.log(message.toString(), "Received By mqtt_node_", id)
    })
    return node
}

