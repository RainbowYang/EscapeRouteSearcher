const config = require("../../../config.json")
const info = require("../utils").info("BROKER")
const Aedes = require('aedes')

const CLIENT = (str) => `\x1b[31m${str}\x1b[0m`
const TOPIC = (str) => `\x1b[33m${str}\x1b[0m`

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
        aedes.on("client",
            client => {
                info(CLIENT(client.id), "has connected")
                // console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + ' ip  ' + (client ? client.ip : null) + '\x1b[0m', 'to broker', aedes.id)
            })

        aedes.on("clientDisconnect",
            client => {
                info(CLIENT(client.id), "has disconnected")
                // console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id)
            })

        aedes.on("subscribe",
            (subs, client) => {
                info(CLIENT(client.id), "subscribed to", TOPIC(subs.map(s => s.topic).join('\n')))
                // console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
                //     '\x1b[0m subscribed to topics: ' + subs.map(s => s.topic).join('\n'), 'from broker', aedes.id)
            })

        aedes.on("publish",
            (packet, client) => {
                client ? info(CLIENT(client.id), "publish", TOPIC(packet.payload.toString()), "on", TOPIC(packet.topic)) : null
                // console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id)

            }
        )
    }
}

module.exports.run = () => new MqttBroker()


