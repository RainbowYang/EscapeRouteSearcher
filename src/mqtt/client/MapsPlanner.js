const mqtt = require('mqtt')
const { underline } = require('chalk')

const { MapModel } = require('../../database/map')
const { NodeStatusModel } = require('../../database/node_status')

const { MQTT_URL } = require('../broker/MQTTBroker')

const { DijkstraGraph } = require('../../utils/DijkstraGraph')
const { Logger } = require('../../utils/Logger')
const { Topic, OrderTopic } = require('../../utils/Topic')

/**
 * 本类管理所有的MapPlanner的，并负责MQTT通信
 */
class MapPlannerManager {
  constructor () {
    this.planners = new Map()
    this.info = new Logger('MapPlannerManager').info

    this.client = mqtt.connect(MQTT_URL, { clientId: 'MapPlannerManager' })
    this.client.subscribe('status/#')

    this.client.on('message', (topic, payload) => {
      this.info('Received', underline(payload.toString()))

      let { map_id, node_id } = Topic.fromString(topic)

      if (!this.planners.has(map_id)) {
        this.planners.set(map_id, new MapPlanner(map_id))
      }

      this.planners.get(map_id).statusChanged(node_id, parseInt(payload.toString()), (order, node_id) =>
        this.client.publish(new OrderTopic(map_id, node_id).toString(), order, { qos: 1, retain: true })
      )
    })
  }
}

class MapPlanner {
  static statusCoefficient = [1, 10, 100]

  loaded = false

  constructor (map_id) {
    this.map_id = map_id
    this.init().then(_ => this.loaded = true)
  }

  async init () {
    let maps = await MapModel.find({ id: this.map_id }).sort({ updated: -1 }) // 倒序排列
    let map = maps[0]
    if (!map) {
      throw 'Map(' + this.map_id + ') is not found'
    }

    this.edges =
      map.edges.map(({ source, target, distance }) => ({ source, target, distance }))
        .concat(map.edges.map(({ source, target, distance }) => ({ source: target, target: source, distance })))
    this.nodes = map.nodes.map(({ id }) => (id))
    this.exits = map.nodes.filter(node => node.isExit).map(node => node.id)

    this.graph = new DijkstraGraph(this.nodes.length)
    this.edges.forEach(({ source, target, distance }) => this.graph.setEdge(source, target, distance))
  }

  statusChanged (node_id, status, publish) {
    if (!this.loaded) {
      setTimeout(() => this.statusChanged(node_id, status, publish), 100)
      return
    }

    let map_id = this.map_id

    // 根据status重新设置graph中的权重
    this.edges
      .filter(({ target }) => target === node_id)
      .forEach(({ source, target, distance }) =>
        this.graph.setEdge(source, target, distance * MapPlanner.statusCoefficient[status]))

    this.nodes
      .forEach(id => {
        let path = this.graph.getPath(id, this.exits)
        publish(path.join(' '), id)

        // updated to mongodb
        let conditions = { map_id, id }
        let update = node_id === id ? { path, status } : { path }
        NodeStatusModel.update(conditions, update, { upsert: true }, (err, res) => { })
      })
  }
}

module.exports = { MapPlannerManager }
