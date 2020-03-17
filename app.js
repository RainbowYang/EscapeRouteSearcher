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


// express 模块
const express = require("express")
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use("/", express.static(__dirname + "/public"))

app.use('/maps', require('./src/routers/maps'))
app.use('/api/maps', require('./src/routers/maps'))
app.use('/nodes', require('./src/routers/nodes'))
app.use('/api/nodes', require('./src/routers/nodes'))

app.get('/show/:name', (req, res) => res.sendFile(__dirname + "/public/show.html"))
app.get('/edit/:name', (req, res) => res.sendFile(__dirname + "/public/editNode.html"))

let port = require("./config.json").express.port
app.listen(port, () => console.log("web open at", port))

// const open = require("open")
// open("http://localhost:3000/?map=show/test")


// MQTT 模块
const mqtt_broker = require('./src/mqtt/broker/mqtt_broker').run()

const MapManager = require('./src/mqtt/client/map_manager')
const DoorNode = require('./src/mqtt/client/door_node')

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
