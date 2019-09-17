const data_processor = require("./utils/data-processor-proxy")
const node_maker = require("./utils/door-node")

const data = require("./data.json")

data_processor.start(data)

const node0 = node_maker(0)
const node1 = node_maker(1)
