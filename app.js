const MapManager = require("./models/map-manager")
const DoorNode = require("./models/door-node")
const mongo = require('./database/mongodb')
const Maps = require('./database/maps')

mongo.getDatabase("bluetooth").then(async db => {
    let maps = await Maps(db).getAll()
    maps.forEach(map => {
        managers[map.name] = new MapManager(map)
    })
})

let managers = {}
let nodes = [...Array(9).keys()].map(v => new DoorNode(v))
setTimeout(() => nodes[2].publish(2), 3000)

// express
// const express = require("express")
// const app = express()
// app.use("/static", express.static(__dirname + "/public"))
// app.listen(3000)
// console.log("open at 3000")

