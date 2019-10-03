const MapManager = require("./models/map-manager")
const DoorNode = require("./models/door-node")
const mongo = require('./database/mongodb')
const Maps = require('./database/maps')

mongo.getDatabase("bluetooth").then(async db => {
    global.maps = Maps(db)
    let all_maps = await global.maps.getAll()
    all_maps.forEach(map => managers[map.name] = new MapManager(map))
})

let managers = {}
let nodes = [...Array(9).keys()].map(v => new DoorNode(v))
setTimeout(() => nodes[2].publish(2), 3000)

// express
const express = require("express")
const app = express()
app.use("/", express.static(__dirname + "/public"))
app.get('/maps', async (req, res) => await res.json(await maps.getAll()))
app.listen(3000, () => console.log("open at 3000"))


