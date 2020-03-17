const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MapSchema = new Schema({
    name: String,
    nodes: [{
        id: String,
        x: Number,
        y: Number
    }],
    edges: [{
        source: String,
        target: String,
        distance: Number
    }],
    exits: [String],
    updated: {type: Date, default: Date.now},
})

module.exports = mongoose.model('maps', MapSchema)
