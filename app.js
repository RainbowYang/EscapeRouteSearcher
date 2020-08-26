// mongoose 模块
const mongoose = require('mongoose')

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

const { mongodb } = require('./config.json')
const url = `mongodb://${mongodb.ip}:${mongodb.port}/${mongodb.db}`
const options = { auth: mongodb.auth }

mongoose.connect(url, options)

mongoose.Promise = global.Promise
const db = mongoose.connection

// express 模块
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,X-Token')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// app.use('/', express.static(__dirname + '/public'))
// app.use('/maps', require('./src/routers/maps'))
app.use('/api/maps', require('./src/routers/maps'))
// app.use('/nodes', require('./src/routers/nodes'))
app.use('/api/nodes', require('./src/routers/nodes'))
// app.get('/show/:name', (req, res) => res.sendFile(__dirname + '/public/show.html'))
// app.get('/edit/:name', (req, res) => res.sendFile(__dirname + '/public/editNode.html'))

const { Logger } = require('./src/utils/Logger')
let { express: { port } } = require('./config.json')
app.listen(port, () => new Logger('express').info('express is listening at', port))

// mqtt 模块
const { MQTTBroker } = require('./src/mqtt/broker/MQTTBroker')
const { MapPlannerManager } = require('./src/mqtt/client/MapsPlanner')
const broker = new MQTTBroker().run()
const manager = new MapPlannerManager()
