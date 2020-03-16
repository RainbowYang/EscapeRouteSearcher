const db = require("./database/db-tools")

const MapManager = require('./mqtt/models/map_manager')
const DoorNode = require('./mqtt/models/door_node')

const server = require('./mqtt/models/mqtt_broker')()

const maps = db.maps
;(async () => {
    // express
    const express = require("express")
    const app = express()
    app.use("/", express.static(__dirname + "/public"))
    app.get('/maps', async (req, res) => await res.json(await maps.getAll()))
    app.get('/maps/:name', async (req, res) => await res.json(await maps.get(req.params.name)))
    app.get('/show/:name', (req, res) => res.sendFile(__dirname + "/public/show.html"))
    app.get('/edit/:name', (req, res) => res.sendFile(__dirname + "/public/editNode.html"))
    app.listen(3000, () => console.log("open at 3000"))

    const managers = (await maps.getAll()).map(MapManager)
    setTimeout(async () => {
        let node_a = DoorNode("a")
        let node_b = DoorNode("b")
        let node_c = DoorNode("c")
        let node_d = DoorNode("d")
        let node_e = DoorNode("e")
        setTimeout(() => {
            node_b.publish(2)
        }, 1000)
    }, 1000)
})()
