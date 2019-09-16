let broker = require("./utils/mqtt-broker")
let data_client = require("./utils/mqtt-data-client")()

const node_maker = require("./utils/door-node")
const node = node_maker(1)
const node2 = node_maker(2)
setInterval(() => {
    node.publish("status/1", "1")
}, 3000)