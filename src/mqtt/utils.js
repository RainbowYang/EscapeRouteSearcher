const config = require("../../config.json")
const moment = require('moment')

const getTime = () => moment().format("YYYY/MM/DD HH:mm:ss.SSS")
const info = name => (...msg) => console.log(`[${getTime()}]`, `[${name.toString()}]`, ...msg)
const mqtt_url = () => `mqtt://${config.mqtt.ip}:${config.mqtt.port}`
const topic = (type, map_name, node_id) => `/${type}/${map_name}/${node_id}`
const splitTopic = (topic) => {
    let s = topic.toString().split("/").filter(t => t !== "")
    return {type: s[0], map_name: s[1], node_id: s[2]}
}
module.exports = {
    info,
    mqtt_url,
    splitTopic,
    topic,
    orderTopic: (map, id) => topic('order', map, id),
    statusTopic: (map, id) => topic('status', map, id)
}
