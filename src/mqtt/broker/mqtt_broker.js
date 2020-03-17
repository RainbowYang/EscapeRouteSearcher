const config = require("../../../config.json")
const info = require("../utils").info("BROKER")
const Aedes = require('aedes')

class MqttBroker {
    constructor() {
        const aedes = Aedes()

        //MQTT server
        const server = require('net').createServer(aedes.handle)
        const port = config.mqtt.port
        server.listen(port, () => info('server started and listening on port', port))

        //server over WebSocket
        const httpServer = require('http').createServer()
        const ws = require('websocket-stream')
        ws.createServer({server: httpServer}, aedes.handle)
        const ws_port = config.mqtt.ws_port
        httpServer.listen(ws_port, () => info('websocket server listening on port', ws_port))

        // onEvent Info
        aedes.on("clientReady",
            client => info(client.id, "connected"))

        aedes.on("clientDisconnect",
            client => info(client.id, "disconnected"))

        aedes.on("subscribe",
            (subs, client) => info(client.id, "subscribe", subs))

        aedes.on("publish",
            (packet, client) => client ?
                info(client.id, "publish", packet.topic, "with", packet.payload.toString()) : null
        )
    }
}

module.exports.run = () => new MqttBroker()


