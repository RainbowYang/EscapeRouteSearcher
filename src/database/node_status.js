const { Schema, model } = require('mongoose')

const NodeStatusSchema = new Schema({
  map_id: { type: String, required: true },
  id: { type: String, required: true },
  status: { type: Number, default: 0, min: 0 }, // 目前用数字表示，越大表示越严重
  path: [String], // 路径为同一个地图的节点的id的数组
  updated: { type: Date, default: Date.now },
})

const NodeStatusModel = model('node_status', NodeStatusSchema)

module.exports = { NodeStatusSchema, NodeStatusModel }
