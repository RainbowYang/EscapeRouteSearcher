const mongoose = require('mongoose')

// 定义一个模式
const Schema = mongoose.Schema

const NodeSchema = new Schema({
    map_name: String,
    id: String,
    status: {type: Number, default: 0},
    path: [String],
})

module.exports = mongoose.model('nodes_status', NodeSchema)
