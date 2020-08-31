const mqtt = require('mqtt')
const AsyncLock = require('async-lock')
const lock = new AsyncLock()
const { underline } = require('chalk')

const db = require('../../database/db')
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
    this.client.on('message', async (topic, payload) => {
      this.info('Received', underline(payload.toString()))
      let { map_id, node_id } = Topic.fromString(topic)

      if (!this.planners.has(map_id)) {
        this.planners.set(map_id, new MapPlanner(map_id))
      }
      await this.planners.get(map_id).setStatus(node_id, parseInt(payload.toString()))
    })
  }
}

/**
 * 负责发布节点的order
 * 以及 更新数据库
 */
class MapPlanner {
  constructor (map_id) {
    this.map_id = map_id
    this.client = mqtt.connect(MQTT_URL, { clientId: `MapPlanner(${map_id})` })
  }

  async reloadMapData () {
    if (!await db.map.has(this.map_id)) {
      throw 'Map(' + this.map_id + ') is not found'
    }

    let lastMap = await db.map.getLast(this.map_id)

    if (!this.map || lastMap.updated.toString() !== this.map.updated.toString()) {
      this.map = lastMap

      this.edges = this.map.edges
        .reduce((edges, { source, target, distance }) =>
          edges.concat({ source, target, distance }, { source: target, target: source, distance }), [])

      this.nodes = this.map.nodes
        .map(node => ({ map_id: this.map_id, id: node.id }))

      this.exits = this.map.nodes
        .filter(node => node.isExit)
        .map(node => node.id)

      this.graph = new DijkstraGraph(this.nodes.length)
      this.edges.forEach(({ source, target, distance }) => this.graph.setEdge(source, target, distance))
    }
  }

  async setStatus (node_id, status) {
    lock.acquire(this.map_id, async (done) => {
      await this.reloadMapData()

      // 设置status
      this.nodes
        .find(({ id }) => id === node_id).status = status

      // 根据status重新设置graph中的权重
      this.edges
        .filter(({ target }) =>
          target === node_id)
        .forEach(({ source, target, distance }) =>
          this.graph.setEdge(source, target, distance * Math.exp(status)))

      this.nodes
        .forEach(node => {
          let path = this.graph.getPath(node.id, this.exits)
          if (node.path !== path) {
            node.path = path

            let topic = new OrderTopic(this.map_id, node.id).toString()
            let order = node.path.join(' ')
            this.client.publish(topic, order, { qos: 1, retain: true })
          }
        })

      await db.node_status.setFor(this.map_id, this.nodes)

      done()
    })
  }
}

module.exports = { MapPlannerManager }
