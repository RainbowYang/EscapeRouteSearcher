// const data_processor = require("./utils/data-processor-proxy")
// const node_maker = require("./utils/door-node")
// const data = require("./public/static/data.json")
//
// data_processor.start(data)
//
// const node1 = node_maker(1)
// const node2 = node_maker(8)

// express
const express = require("express")
const app = express()
app.use(express.static("public"))
app.listen(3000)
