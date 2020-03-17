const DijkstraGraph = require("../dijkstra-graph")
const mqtt = require('mqtt')
const utils = require("../utils")

/**
 * MapManager用于根据节点的状态，计算节点的指令
 */
class MapManager {
    constructor(map) {
        this.map = map

        this.name = 'MapManager_' + map.name
        this.info = utils.info(this.name)

        // node的order缓存
        this.orders = new Map()

        this.proxy = new MapManager.Proxy(this)
        this.graph = new DijkstraGraph(map.nodes.length)
        map.edges.forEach(edge => this.graph.setEdge(edge.source, edge.target, edge.distance, true))
    }

    setStatus(id, status) {
        this.map.edges.filter(edge => edge.target.toString() === id).forEach(edge =>
            this.graph.setEdge(edge.source, edge.target, edge.distance * Math.exp(parseInt(status))))
    }

    getOrder(id) {
        let order = this.graph.getPath(id, this.map.exits).map(index => this.map.nodes[index].id).join(" ")
        return order === this.orders[id] ? null : this.orders[id] = order
    }
}

/**
 * 为 [MapManager] 处理mqtt通信
 * @type {MapManager.MapManagerProxy}
 */
MapManager.Proxy = class Proxy {
    constructor(manager) {
        let client = mqtt.connect(utils.mqtt_url(), {clientId: manager.name})

        // 连接时，订阅所有节点的信息
        client.on('connect', () => {
                let topic = utils.makeStatusTopic(manager.map.name, "#")
                client.subscribe(topic, {qos: 1}, () => manager.info("Subscribed", topic))
            }
        )

        // 收到信息时，处理收到的节点状态，发布节点的指令
        client.on('message', (topic, payload) => {
            manager.info("Received", payload.toString(), "Under", topic)
            manager.setStatus(utils.splitTopic(topic).node_id, payload)
            manager.map.nodes.forEach(node => {
                let order = manager.getOrder(node.id)
                if (order) {
                    let orderTopic = utils.makeOrderTopic(manager.map.name, node.id)
                    client.publish(orderTopic, order, {qos: 1, retain: true},
                        () => manager.info("Publish", order, "Under", orderTopic))
                }
            })
        })
    }
}

module.exports = (map) => new MapManager(map)
