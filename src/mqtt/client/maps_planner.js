const mqtt = require('mqtt')
const utils = require("../utils")
const DijkstraGraph = require("../dijkstra-graph")
const NodeModel = require('../../database/models/node_status')
const MapModel = require('../../database/models/map_structure')

const orderTopic = utils.orderTopic
const splitTopic = utils.splitTopic

class MapsPlanner {
    constructor() {
        this.planners = new Map()

        this.client = mqtt.connect(utils.mqtt_url(), {clientId: "MapsPlanner"})
        this.client.subscribe("#")

        this.client.on('message', (topic, payload) => {
            let {type, map_name, node_id} = splitTopic(topic)

            if (type === 'status') {
                if (!this.planners.has(map_name)) {
                    this.planners.set(map_name, new MapPlanner(map_name))
                }

                this.planners.get(map_name)
                    .statusChanged(node_id, parseInt(payload.toString()),
                        (id, order) =>
                            this.client.publish(orderTopic(map_name, id), order, {qos: 1, retain: true}))

            }
        })
    }
}

class MapPlanner {
    static statusCoefficient = [1, 10, 100]

    loaded = false
    orders = {}

    constructor(map_name) {
        this.map_name = map_name
        this.init().then(r =>
            this.loaded = true
        )
    }

    async init() {
        let maps = await MapModel.find({name: this.map_name}).sort({updated: -1}) // 倒序排列
        let map = maps[0] // 拿到最新的一个
        if (!map) {
            throw "Map(" + this.map_name + ") is not found"
        }

        this.edges = map.edges.map(({source, target, distance}) => ({source, target, distance})).concat(
            map.edges.map(({source, target, distance}) => ({source: target, target: source, distance})))
        this.nodes = map.nodes.map(({id}) => ({id}))
        this.exits = map.nodes.filter(node => node.isExit).map(node => node.id)

        this.graph = new DijkstraGraph(this.nodes.length)
        this.edges.forEach(({source, target, distance}) => this.graph.setEdge(source, target, distance))
    }

    async statusChanged(node_id, status, callback) {
        if (!this.loaded) {
            setTimeout(() => this.statusChanged(node_id, status, callback), 800)
            return
        }

        // 根据status设置graph中的权重
        this.edges.filter(({target}) => target === node_id).forEach(({source, target, distance}) =>
            this.graph.setEdge(source, target, distance * MapPlanner.statusCoefficient[status]))

        for (let {id} of this.nodes) {
            let conditions = {map_name: this.map_name, id}
            let update = {}

            if (id === node_id) {
                update.status = status
            }

            let path = this.graph.getPath(id, this.exits)
            let order = path.join(' ')

            if (this.orders[id] !== order) {
                this.orders[id] = order
                update.path = path
                callback(id, order)
            }

            try {
                if (await NodeModel.exists(conditions)) {
                    await NodeModel.updateOne(conditions, update)
                } else {
                    await NodeModel.create({...conditions, ...update})
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}


module.exports = () => new MapsPlanner()
