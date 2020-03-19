const DijkstraGraph = require("../dijkstra-graph")
const mqtt = require('mqtt')
const utils = require("../utils")
const NodeModel = require('../../database/models/node_status')
const {statusTopic, splitTopic} = utils

class MapManager {
    constructor(map) {
        this.map = map
        this.exits = map.nodes.filter(node => node.isExit).map(node => node.id)

        let name = `MapManager(${map.name})`
        this.info = utils.info(name)

        this.graph = new DijkstraGraph(map.nodes.length)
        this.map.edges.forEach(edge =>
            this.graph.setEdge(edge.source, edge.target, edge.distance, true))

        // node的order缓存
        this.orders = new Map()

        // // 刷新数据库
        // e => NodeModel.create({map_name: this.map.name, id: node.id}, err => null))

        // 接受Mqtt
        this.client = mqtt.connect(utils.mqtt_url(), {clientId: name})
        this.client.subscribe(statusTopic(map.name, "#"), {qos: 1})

        // 收到信息时，处理收到的节点状态，发布节点的指令
        this.client.on('message', (topic, payload) => {
            // this.info("Received", payload.toString(), "Under", topic)
            let {node_id} = splitTopic(topic)
            this.statusChanged(node_id, payload.toString())
            this.calcPath()
        })
        this.calcPath()
    }

    statusChanged(id, status) {
        this.map.edges
            .filter(edge => edge.target === id)
            .forEach(edge =>
                this.graph.setEdge(edge.source, edge.target, edge.distance * Math.exp(parseInt(status))))
        this.map.edges
            .filter(edge => edge.source === id)
            .forEach(edge =>
                this.graph.setEdge(edge.target, edge.source, edge.distance * Math.exp(parseInt(status))))

        NodeModel.findOneAndUpdate({map_name: this.map.name, id}, {status}).exec()
    }

    calcPath() {
        this.map.nodes.forEach(node => {
            let path = this.graph.getPath(node.id, this.exits)
            let order = path.join(' ')

            if (order !== this.orders[node.id]) {
                this.orders[node.id] = order

                let orderTopic = utils.orderTopic(this.map.name, node.id)
                this.client.publish(orderTopic, order, {qos: 1, retain: true},
                    // () => this.info("Publish", order, "Under", orderTopic)
                )

                NodeModel.findOneAndUpdate({map_name: this.map.name, id: node.id}, {path}).exec()
            }
        })
    }
}

module.exports = (map) => new MapManager(map)
