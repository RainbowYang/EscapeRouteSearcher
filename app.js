// mongoose 模块
const mongoose = require('mongoose')
const config = require("./config.json").mongodb

const url = `mongodb://${config.ip}:${config.port}/${config.location}`
const options = {auth: config.auth}

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

mongoose.connect(url, options)
mongoose.Promise = global.Promise
const db = mongoose.connection
// 将连接与错误事件绑定（以获得连接错误的提示）
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'))

// express
const express = require("express")
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use("/", express.static(__dirname + "/public"))
app.use('/maps', require('./src/routers/maps'))
app.use('/api/maps', require('./src/routers/maps'))

app.get('/show/:name', (req, res) => res.sendFile(__dirname + "/public/show.html"))
app.get('/edit/:name', (req, res) => res.sendFile(__dirname + "/public/editNode.html"))

app.listen(3000, () => console.log("open at 3000"))

const open = require("open")
open("http://localhost:3000/?map=show/test")

// const db = require("./src/database/db-tools")
const MapManager = require('./src/mqtt/map_manager')
const DoorNode = require('./src/mqtt/door_node')

const server = require('./src/mqtt/mqtt_broker')()

const map_model = require('./src/database/models/maps')
map_model.find().exec((err, maps) => {
    const managers = maps.map(MapManager)
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
})
// // const maps = db.maps
// ;(async () => {
//
//     // app.get('/maps', async (req, res) => await res.json(await maps.getAll()))
//     // app.get('/maps/:name', async (req, res) => await res.json(await maps.get(req.params.name)))
//
//
//     // const managers = (await maps.getAll()).map(MapManager)
//     // setTimeout(async () => {
//     //     let node_a = DoorNode("a")
//     //     let node_b = DoorNode("b")
//     //     let node_c = DoorNode("c")
//     //     let node_d = DoorNode("d")
//     //     let node_e = DoorNode("e")
//     //     setTimeout(() => {
//     //         node_b.publish(2)
//     //     }, 1000)
//     // }, 1000)
// })()
