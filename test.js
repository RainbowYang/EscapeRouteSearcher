const DoorNode = require("./models/door-node")

let node = new DoorNode(1)

setTimeout(() => node.publish(2), 5000)