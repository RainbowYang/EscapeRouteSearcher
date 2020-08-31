// 用于模拟门锁节点通讯的测试

const { Node } = require('../src/mqtt/client/Node')

new Node('center').publish(2)
new Node('up').publish(2)
// new Node('down').publish(0)
// new Node('left').publish(0)
// new Node('right').publish(0)
// new Node('up_left').publish(0)
// new Node('up_right').publish(0)
// new Node('down_left').publish(0)
// new Node('down_right').publish(0)
