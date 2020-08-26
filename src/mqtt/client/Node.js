const mqtt = require('mqtt')
const { underline } = require('chalk')

const { MQTT_URL } = require('../broker/MQTTBroker')

const { Logger } = require('../../utils/Logger')
const { OrderTopic, StatusTopic } = require('../../utils/Topic')

/**
 * 用于模拟一个节点，通常用于测试。
 *
 * 每个节点应当拥有一个唯一的id。
 * 每个节点都应该:
 *  通过 topic ("order/[map_id]/[node_id]")  的topic订阅(subscribe)自身应指示的逃跑方向
 *  通过 topic ("status/[map_id]/[node_id]") 的topic发布(publish)自身周围的火灾状态，并设置qos大于等于1。
 */
class Node {
  constructor (node_id, map_id = 'test') {
    this.name = `Node(${map_id}/${node_id})`
    this.info = new Logger(this.name).info

    this.subscribeTopic = new OrderTopic(map_id, node_id).toString()
    this.publishTopic = new StatusTopic(map_id, node_id).toString()

    this.client = mqtt.connect(MQTT_URL, { clientId: this.name })
    this.client.subscribe(this.subscribeTopic)
    this.client.on('message', (topic, payload) =>
      this.info('Received', underline(payload.toString())))
  }

  publish (message) {
    this.client.publish(this.publishTopic, message.toString(), { qos: 1, retain: true })
    return this
  }
}

module.exports = { Node }

