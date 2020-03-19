const mongoose = require('mongoose')

const NodeStatusSchema = new mongoose.Schema({
    map_name: {type: String, required: true},
    id: {type: String, required: true},
    status: {type: Number, default: 0, min: 0},
    path: [String],
    updated: {type: Date, default: Date.now},
})

module.exports = mongoose.model('node_status', NodeStatusSchema)
