const DijkstraGraph = require("../dijkstra-graph")
const mqtt = require('mqtt')
const utils = require("../utils")
const node_model = require('../../database/models/nodes')
const {statusTopic, splitTopic} = utils

class MapManager {
    constructor(map) {
        this.map = map

        node_model.deleteMany({map_name: this.map.name}).exec()
        this.map.nodes.forEach(node => node_model.create({map_name: this.map.name, id: node.id}, err => null))

        const name = 'MapManager_' + map.name
        this.info = utils.info(name)

        // node的order缓存
        this.orders = new Map()

        this.graph = new DijkstraGraph(map.nodes.length)
        this.map.edges.forEach(edge =>
            this.graph.setEdge(edge.source, edge.target, edge.distance, true))

        this.client = mqtt.connect(utils.mqtt_url(), {clientId: map.name})
        this.client.subscribe(statusTopic(map.name, "#"), {qos: 1})

        // 收到信息时，处理收到的节点状态，发布节点的指令
        this.client.on('message', (topic, payload) => {
            this.info("Received", payload.toString(), "Under", topic)

            let {node_id} = splitTopic(topic)
            this.statusChanged(node_id, payload.toString())
        })
    }

    statusChanged(id, status) {
        this.map.edges
            .filter(edge => edge.target === id)
            .forEach(edge =>
                this.graph.setEdge(edge.source, edge.target, edge.distance * Math.exp(parseInt(status))))

        node_model.findOneAndUpdate({map_name: this.map.name, id}, {status}).exec()

        this.map.nodes.forEach(node => {
            let path = this.graph.getPath(node.id, this.map.exits)
            let order = path.join(' ')

            if (order !== this.orders[node.id]) {
                this.orders[node.id] = order

                let orderTopic = utils.orderTopic(this.map.name, node.id)
                this.client.publish(orderTopic, order, {qos: 1, retain: true},
                    () => this.info("Publish", order, "Under", orderTopic))

                node_model.findOneAndUpdate({map_name: this.map.name, id: node.id}, {path}).exec()
            }
        })
    }
}

module.exports = (map) => new MapManager(map)
