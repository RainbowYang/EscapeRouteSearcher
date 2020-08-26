const { Schema, model } = require('mongoose')

const MapSchema = new Schema({
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

const MapModel = model('map', MapSchema)

module.exports = { MapSchema, MapModel }
