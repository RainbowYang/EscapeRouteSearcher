const MapManager = require("./utils/map-manager")
const DoorNode = require("./utils/door-node")

const data = require("./public/data.json")
let managers = Object.keys(data.maps).map(key => new MapManager(data.maps[key]))
let nodes = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(v => new DoorNode(v, 'test'))

setTimeout(() => nodes[2].publish(2), 3000)

// express
const express = require("express")
const app = express()
app.use("/static", express.static(__dirname + "/public"))
app.listen(3000)
