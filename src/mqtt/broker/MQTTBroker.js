const Aedes = require('aedes')
const ws = require('websocket-stream')
const http = require('http')
const net = require('net')
const { yellow, red, underline } = require('chalk')

const { mqtt: { port, ws_port } } = require('../../../config.json')
const { Logger } = require('../../utils/Logger')

/**
 * 基于aedes创建的一个MQTT的服务器（Broker）
 *
 * 可以同时通过TCP和WS进行访问
 */
class MQTTBroker {

  static MQTT_URL = `mqtt://localhost:${port}`

  constructor () {
    this.aedes = Aedes()
    this.info = new Logger('BROKER').info

    this.aedes.on('client', client =>
      this.info(red(client.id), 'has connected')
    )

    this.aedes.on('clientDisconnect', client =>
      this.info(red(client.id), 'has disconnected')
    )

    this.aedes.on('subscribe', (subscription, client) =>
      this.info(red(client.id), 'subscribed to', yellow(subscription.map(s => s.topic).join('\n')))
    )

    this.aedes.on('publish', (packet, client) => client ?
      this.info(red(client.id), 'publish', underline(packet.payload.toString()), 'on', yellow(packet.topic)) : null
    )
  }

  run () {
    //MQTT server
    this.server = net.createServer(this.aedes.handle)
    this.server.listen(port, () =>
      this.info('MQTT server is listening on port', yellow(port)))

    //MQTT over WebSocket
    this.httpServer = http.createServer()
    ws.createServer({ server: this.httpServer }, this.aedes.handle)
    this.httpServer.listen(ws_port, () =>
      this.info('MQTT over websocket is listening on port', yellow(ws_port)))

    return this
  }
}

module.exports = { MQTTBroker, MQTT_URL: MQTTBroker.MQTT_URL }


