/**
 * 本类用来生成和解析用于mqtt的topic
 */
class Topic {
  static fromString (topic) {
    let [type, map_id, node_id] = topic.toString().split('/').filter(t => t !== '')
    return new Topic(type, map_id, node_id)
  }

  static toString (Topic) {
    return Topic.toString()
  }

  constructor (type, map_id, node_id) {
    this.type = type
    this.map_id = map_id
    this.node_id = node_id
  }

  toString () {
    return [this.type, this.map_id, this.node_id].join('/')
  }
}

class OrderTopic extends Topic {
  constructor (map_id, node_id) {super('order', map_id, node_id)}
}

class StatusTopic extends Topic {
  constructor (map_id, node_id) {super('status', map_id, node_id)}
}

module.exports = { Topic, OrderTopic, StatusTopic }

