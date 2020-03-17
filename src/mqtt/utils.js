const moment = require('moment')
const config = require("../../config.json")
const getTime = () => moment().format("YYYY/MM/DD HH:mm:ss.SSS")
module.exports = {
    info: (name) => (...msg) => console.log(`[${getTime()}]`, `[${name.toString()}]`, ...msg),
    getMqttAddress: () => `mqtt://${config.mqtt.ip}:${config.mqtt.port}`,
    makeOrderTopic: (map, id) => `/order/${map}/${id}`,
    makeStatusTopic: (map, id) => `/status/${map}/${id}`,
    splitTopic(topic) {
        let s = topic.toString().split("/").filter(t => t !== "")
        return {type: s[0], map: s[1], id: s[2]}
    }
}
