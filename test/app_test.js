// 用于模拟门锁节点通讯的测试

const { Node } = require('../src/mqtt/client/Node')

new Node('center').publish(2)
new Node('up').publish(2)
// DoorNode("down").publish(0)
// DoorNode("left").publish(0)
// DoorNode("right").publish(0)
//
// DoorNode("up_left").publish(0)
// DoorNode("up_right").publish(0)
// DoorNode("down_left").publish(0)
// DoorNode("down_right").publish(0)
// })
