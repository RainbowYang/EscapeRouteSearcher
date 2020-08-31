const { Schema, model } = require('mongoose')

const nodeStatusSchema = new Schema({
  map_id: { type: String, required: true },
  id: { type: String, required: true },
  status: { type: Number, default: 0, min: 0 }, // 目前用数字表示，越大表示越严重
  path: { type: [String], default: [] }, // 路径为同一个地图的节点的id的数组
  updated: { type: Date, default: Date.now },
})

const nodeStatusModel = model('node_status', nodeStatusSchema)

module.exports = {
  // nodeStatusSchema,
  // nodeStatusModel,

  async getFrom (map_id) {
    return nodeStatusModel.find({ map_id })
  },

  async setFor (map_id, nodes) {
    await nodeStatusModel.deleteMany({ map_id })
    return nodeStatusModel.insertMany(nodes)
  }
}
