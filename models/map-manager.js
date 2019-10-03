/**
 * MapManager用于根据节点的状态，计算节点的指令
 */

const DijkstraGraph = require("./dijkstra-graph")
const mqtt = require('mqtt')
const utils = require("../utils")

class MapManager {
    constructor(map) {
        this.map = map

        this.name = 'MapManager_' + map.name
        this.info = utils.info(this.name)

        this.orders = []

        this.proxy = new MapManager.Proxy(this)
        this.graph = new DijkstraGraph(map.nodes.length)
        map.edges.forEach(edge => this.graph.setEdge(edge.source, edge.target, edge.distance))

        map.nodes.forEach((_, index) => this[index] = [])
    }

    setStatus(id, status) {
        this.map.edges.filter(edge => edge.target.toString() === id).forEach(edge =>
            this.graph.setEdge(edge.source, edge.target, edge.distance * Math.exp(parseInt(status))))
    }

    getOrder(id) {
        let order = this.graph.Dijkstra(id, this.map.exits).join(" ")
        return order === this.orders[id] ? null : this.orders[id] = order
    }
}

/**
 * 为 [MapManager] 处理mqtt通信
 * @type {MapManager.MapManagerProxy}
 */
MapManager.Proxy = class MapManagerProxy {
    constructor(manager) {
        let client = mqtt.connect(utils.getMqttAddress(), {clientId: manager.name})

        // 连接时，订阅所有节点的信息
        client.on('connect', () =>
            manager.map.nodes.forEach((_, index) => {
                let topic = utils.makeStatusTopic(manager.map.name, index)
                client.subscribe(topic, {qos: 1}, () => manager.info("Subscribed", topic))
            })
        )

        // 收到信息时，处理收到的节点状态，发布节点的指令
        client.on('message', (topic, payload) => {
            manager.info("Received", payload.toString(), "Under", topic)
            manager.setStatus(utils.splitTopic(topic).id, payload)
            manager.map.nodes.forEach((value, index) => {
                let order = manager.getOrder(index)
                if (order !== null) {
                    let orderTopic = utils.makeOrderTopic(manager.map.name, index)
                    client.publish(orderTopic, order, () => manager.info("Publish", order, "Under", orderTopic))
                }
            })
        })
    }
}

module.exports = MapManager
