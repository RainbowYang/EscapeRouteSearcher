const mongoose = require('mongoose')

const MapStructureSchema = new mongoose.Schema({
    name: {type: String, required: true},
    nodes: [{
        id: {type: String, required: true},
        x: {type: Number, min: 0},
        y: {type: Number, min: 0},
        isExit: {type: Boolean, default: false}
    }],
    edges: [{
        source: {type: String, required: true,},
        target: {type: String, required: true},
        distance: {type: Number, min: 0}
    }],
    updated: {type: Date, default: Date.now},
})

module.exports = mongoose.model('map_structure', MapStructureSchema)
