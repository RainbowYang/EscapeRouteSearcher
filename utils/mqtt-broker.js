/**
 * 这只是一个简单的mqtt的broker
 */
const mosca = require("mosca")
const port = require("../config.json").mqtt.port
const settings = {port}
const server = new mosca.Server(settings, null)
server.on('ready', () => info("Mosca Broker is up and running"))
server.on("clientConnected", client => info("Connected:", client.id))
server.on("subscribed", (topic, client) => info("Subscribed", topic, "By", client.id))
server.on('published', (packet, client) => {
        if (client)
            info("Published", packet.payload.toString(), "Under", packet.topic, "By", client.id)
    }
)
server.on("clientDisconnected", client => info('Disconnected:', client.id))

module.exports = server

function info() {
    if (arguments.length)
        console.log("[" + new Date().toLocaleString() + "][INFO]", ...arguments)
}
