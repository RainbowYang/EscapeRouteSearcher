/**
 * DataProcessor用于根据节点的状态，计算节点的指令
 */
const mqtt = require('mqtt')

const DijkstraGraph = require("./dijkstra-graph")
const utils = require("./my-utils")

const STATUS = utils.STATUS
const ORDER = utils.ORDER
const NAME = "MapManager"

const info = utils.info(NAME)

class MapManager {
    constructor(map) {
        // map 应拥有nodes和edges属性
        this.map = map
        this.proxy = new MapManager.Proxy(this)

        this.graph = new DijkstraGraph(map.nodes.length)
        map.edges.forEach(edge => this.graph.setEdge(edge.source, edge.target, edge.distance))

        this.setStatus = (id, status) =>
            map.edges.filter(edge => edge.target.toString() === id).forEach(edge =>
                this.graph.setEdge(edge.source, edge.target, edge.distance * Math.exp(parseInt(status))))

        this.getOrder = (id) => this.graph.Dijkstra(id, this.map.exits).toString()
    }
}

/**
 * 为 [MapManager] 处理mqtt通信
 * @type {MapManager.MapManagerProxy}
 */
MapManager.Proxy = class MapManagerProxy {
    constructor(manager) {
        let client = mqtt.connect(utils.getMqttAddress(), {clientId: NAME})

        // 连接时，订阅所有节点的信息
        client.on('connect', () =>
            manager.map.nodes.forEach((_, index) => {
                let topic = utils.makeTopic(STATUS, manager.map.name, index)
                client.subscribe(topic, {qos: 1}, () => info("Subscribed", topic))
            })
        )

        // 收到信息时，处理收到的节点状态，发布节点的指令
        client.on('message', (topic, payload) => {
            info("Received", payload.toString(), "Under", topic)
            let {id} = utils.splitTopic(topic)
            manager.setStatus(id, payload)
            let order = manager.getOrder(id)
            let orderTopic = utils.makeTopic(ORDER, manager.map.name, id)
            client.publish(orderTopic, order, () => info("Publish", order, "Under", orderTopic))
        })
    }
}

module.exports = MapManager
