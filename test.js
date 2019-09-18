const data_processor = require("./utils/data-processor-proxy")
const node_maker = require("./utils/door-node")
const data = require("./public/static/data.json")

data_processor.start(data)

const node1 = node_maker(1)
const node2 = node_maker(2)
const node3 = node_maker(3)
const node4 = node_maker(4)
const node5 = node_maker(5)
const node6 = node_maker(6)
const node7 = node_maker(7)
const node8 = node_maker(8)

setTimeout(() =>
    node2.publish('status/2', "2", {qos: 1, retain: true}), 3000)

// express
const express = require("express")
const app = express()
app.use(express.static("public"))
app.listen(3000)
