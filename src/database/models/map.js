const { Schema, model } = require('mongoose')
const { uniq: unique } = require('lodash')

const mapSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String }, // 用于显示，如果不存在则显示id
  nodes: [{
    id: { type: String, required: true },
    name: { type: String }, // 用于显示，如果不存在则显示id
    location: {
      type: { x: Number, y: Number }, required: true
    },
    isExit: { type: Boolean, required: true, default: false },
  }],
  edges: [{
    source: { type: String, required: true, },
    target: { type: String, required: true },
    distance: { type: Number, required: true, min: 0 }
  }],
  updated: { type: Date, default: Date.now },
})

const mapModel = model('map', mapSchema)

module.exports = {
  // mapSchema,
  // mapModel,

  /**
   * 查询是否存在id为[id]的map
   * @param {String} id
   * @returns {Promise<Boolean>}
   */
  async has (id) {
    return mapModel.exists({ id })
  },

  /**
   * 返回所有的地图id
   * @returns {Promise<String[]>}
   */
  async getIds () {
    let ids = (await mapModel
      .find({}, { id: 1 }) // 只获取id
      .sort({ id: 1 }))    // 按照id进行排序
      .map(({ id }) => id) // 把对象数组拆成字符串数组
    return unique(ids)
  },

  /**
   * 根据id，拿到map的所有记录
   * @param {String} id
   * @returns {Promise<*>}
   */
  async get (id) {
    return mapModel
      .find({ id })
      .sort({ updated: -1 })
  },

  /**
   * 根据id，拿到map的最后记录
   * @param {String} id
   * @returns {Promise<*>}
   */
  async getLast (id) {
    return (await mapModel
      .find({ id })
      .sort({ updated: -1 })
      .limit(1))[0]
  },

  /**
   * 添加maps
   * @param maps
   * @returns {Promise<Promise|void>}
   */
  async add (...maps) {
    return mapModel.insertMany(maps)
  },

  /**
   * 根据id，删除对应的所有map
   * @param {String} id
   * @returns {Promise<Promise|*>}
   */
  async delete (id) {
    return mapModel.deleteMany({ id })
  }
}

