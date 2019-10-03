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

        // 让node的id对应到其在数组中的index
        this.nodeMap = {}
        map.nodes.forEach((node, index) => this.nodeMap[node.id] = index)

        // node的order缓存
        this.orders = {}
        map.nodes.forEach(node => this.orders[node.id] = [])

        this.proxy = new MapManager.Proxy(this)
        this.graph = new DijkstraGraph(map.nodes.length)
        map.edges.forEach(edge => {
            this.setEdgeById(edge.source, edge.target, edge.distance)
            this.setEdgeById(edge.target, edge.source, edge.distance)
        })
    }

    setEdgeById(source, target, weight) {
        this.graph.setEdge(this.nodeMap[source], this.nodeMap[target], weight)
    }

    getPathById(begin, ends) {
        return this.graph.getPath(this.nodeMap[begin], ends.map(id => this.nodeMap[id]))
    }

    setStatus(id, status) {
        this.map.edges.filter(edge => edge.target.toString() === id).forEach(edge =>
            this.setEdgeById(edge.source, edge.target, edge.distance * Math.exp(parseInt(status))))
    }

    getOrder(id) {
        let order = this.getPathById(id, this.map.exits).join(" ")
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
            manager.map.nodes.forEach(node => {
                let topic = utils.makeStatusTopic(manager.map.name, node.id)
                client.subscribe(topic, {qos: 1}, () => manager.info("Subscribed", topic))
            })
        )

        // 收到信息时，处理收到的节点状态，发布节点的指令
        client.on('message', (topic, payload) => {
            manager.info("Received", payload.toString(), "Under", topic)
            manager.setStatus(utils.splitTopic(topic).id, payload)
            manager.map.nodes.forEach(node => {
                let order = manager.getOrder(node.id)
                if (order) {
                    let orderTopic = utils.makeOrderTopic(manager.map.name, node.id)
                    client.publish(orderTopic, order, () => manager.info("Publish", order, "Under", orderTopic))
                }
            })
        })
    }
}

module.exports = MapManager
